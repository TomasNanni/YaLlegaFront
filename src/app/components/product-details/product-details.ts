import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { ProductDetailsI } from '../../interfaces/product';
import { Router } from '@angular/router';
import { Spinner } from '../../spinner/spinner/spinner';

@Component({
  selector: 'app-product-details',
  imports: [Spinner],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  idRestaurant = input.required<number>();
  idProduct = input.required<number>();

  productService = inject(ProductService);
  cartService = inject(CartService);
  auth = inject(AuthService);
  router = inject(Router);

  product: ProductDetailsI | undefined;
  loadingProduct = signal<boolean>(false);
  cartRequestInProgress = false;

  isHappyHour = computed(() => {
    if (!this.product || !this.product.happyHourStart || !this.product.happyHourEnd) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start = parseTime(this.product.happyHourStart);
    const end = parseTime(this.product.happyHourEnd);

    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    } else {
      return currentTime >= start || currentTime <= end;
    }
  });

  async ngOnInit() {
    if (this.idProduct()) {
      this.loadingProduct.set(true);
      const prod = await this.productService.getProductById(this.idProduct());
      if (prod) {
        this.product = prod;
      }
      this.loadingProduct.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/restaurant', this.idRestaurant()]);
  }

  async handleAddToCart() {
    if (!this.product) return;

    this.cartRequestInProgress = true;

    try {
      let success = false;

      if (!this.auth.idCart) {
        const cartId = await this.cartService.createCart(this.idProduct());
        success = cartId !== null;
      } else {
        const cartId = parseInt(this.auth.idCart);
        success = await this.cartService.addProduct(
          cartId,
          this.idProduct()
        );
      }

      if (success) {
        this.router.navigate(['/restaurant', this.idRestaurant()]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.cartRequestInProgress = false;
    }
  }
}
