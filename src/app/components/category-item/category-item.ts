import { Component, input } from '@angular/core';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-category-item',
  imports: [],
  templateUrl: './category-item.html',
  styleUrl: './category-item.scss',
})
export class CategoryItem {
category = input.required<Category>();
}
