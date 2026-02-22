import { Component, input } from '@angular/core';
import { Category } from '../../interfaces/category';
import { ProductItem } from "../product-item/product-item";

@Component({
  selector: 'app-category-item',
  imports: [ProductItem],
  templateUrl: './category-item.html',
  styleUrl: './category-item.scss',
})
export class CategoryItem {
  category = input.required<Category>();
}
