import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { RestaurantService } from '../../services/restaurant-service';
import { CartProductI } from '../../interfaces/product';
import { CartRestaurantGroup } from '../../interfaces/cart';
import { Spinner } from '../../spinner/spinner/spinner';
import { TopBarLayout } from '../../layout/layout/top-bar-layout/top-bar-layout';
import { showConfirmModal, showCompletionModal } from '../../modals/modals';

@Component({
  selector: 'app-cart-page',
  imports: [Spinner, RouterLink, TopBarLayout],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage implements OnInit {
  idCart = input.required<number>();

  cartService = inject(CartService);
  restaurantService = inject(RestaurantService);

  loading = signal<boolean>(true);
  products = signal<CartProductI[]>([]);
  groups = signal<CartRestaurantGroup[]>([]);

  async ngOnInit() {
    await this.loadCart();
  }

  async loadCart() {
    this.loading.set(true);
    const cartProducts = await this.cartService.getCart(this.idCart());
    if (cartProducts) {
      this.products.set(cartProducts);
      await this.buildGroups(cartProducts);
    }
    this.loading.set(false);
  }

  async buildGroups(products: CartProductI[]) {
    const result: CartRestaurantGroup[] = [];

    for (const product of products) {
      const existingGroup = result.find(g => g.restaurantId === product.restaurantId);

      if (existingGroup) {
        existingGroup.products.push(product);
      } else {
        const restaurant = await this.restaurantService.getRestaurantById(product.restaurantId);
        result.push({
          restaurantId: product.restaurantId,
          restaurantName: product.restaurantName,
          contact: restaurant!.contact,
          products: [product],
        });
      }
    }
    this.groups.set(result);
  }

  finalPrice(product: CartProductI): number {
    return product.basePrice * (1 - product.discount / 100);
  }

  subtotal(group: CartRestaurantGroup): number {
    return group.products.reduce((sum, p) => sum + this.finalPrice(p) * p.amount, 0);
  }

  async onDeleteProduct(productId: number) {
    const result = await showConfirmModal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción quitará el producto de tu carrito.',
      confirmButtonText: 'Eliminar',
    });
    if (!result.isConfirmed) return;

    const ok = await this.cartService.deleteProduct(this.idCart(), [productId]);
    if (ok) {
      const updated = this.products().filter(p => p.id !== productId);
      this.products.set(updated);
      await this.buildGroups(updated);
    }
  }

  async onDeleteAll() {
    const result = await showConfirmModal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos de tu carrito.',
      confirmButtonText: 'Vaciar',
    });
    if (!result.isConfirmed) return;

    const ok = await this.cartService.deleteCart(this.idCart());
    if (ok) {
      this.products.set([]);
      this.groups.set([]);
    }
  }

  async onPlaceOrder(group: CartRestaurantGroup) {
    const isOpen = await this.restaurantService.isRestaurantOpen(group.restaurantId);

    if (!isOpen) {
      await showCompletionModal.fire({
        title: 'Restaurante cerrado',
        text: `${group.restaurantName} no está abierto en este momento. Intentá más tarde.`,
        icon: 'error',
      });
      return;
    }

    const productLines = group.products
      .map(p => {
        const qty = p.amount > 1 ? ` x${p.amount}` : '';
        return `- ${p.name}${qty}: $${this.finalPrice(p) * p.amount}`;
      })
      .join('\n');

    const message = `Hola! Quiero hacer un pedido:\n${productLines}\n\nGracias!`;

    const phone = group.contact.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');

    const productIds = group.products.map(p => p.id);
    await this.cartService.deleteProduct(this.idCart(), productIds);

    const remaining = this.products().filter(p => p.restaurantId !== group.restaurantId);
    this.products.set(remaining);
    await this.buildGroups(remaining);
  }
}
