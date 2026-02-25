import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new-product-item',
  imports: [RouterLink],
  templateUrl: './new-product-item.html',
  styleUrl: './new-product-item.scss',
})
export class NewProductItem {
  idRestaurant = input.required<number>();
}
