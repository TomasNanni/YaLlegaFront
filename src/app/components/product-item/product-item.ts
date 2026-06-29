import { Component, computed, input } from '@angular/core';
import { ProductDetailsI } from '../../interfaces/product';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-item',
  imports: [RouterLink],
  templateUrl: './product-item.html',
  styleUrl: './product-item.scss',
})
export class ProductItem {
  product = input.required<ProductDetailsI>();
  isOwner = input.required<boolean>();
  idRestaurant = input<number>();

  finalPrice = computed(() =>
    this.product().basePrice * (1 - this.product().discount / 100)
  );
}
