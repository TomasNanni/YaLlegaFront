import { Component, input, OnInit, Signal } from '@angular/core';
import { Category, NewEditCategoryI } from '../../interfaces/category';
import { ProductItem } from "../product-item/product-item";
import { RouterLink } from '@angular/router';
import { NewProductItem } from "../new-product-item/new-product-item";

@Component({
  selector: 'app-category-item',
  imports: [ProductItem, RouterLink, NewProductItem],
  templateUrl: './category-item.html',
  styleUrl: './category-item.scss',
})
export class CategoryItem {
  category = input.required<Category>();
  isOwner = input.required<boolean>();
}
