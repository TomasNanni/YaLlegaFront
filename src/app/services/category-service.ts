import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories: Category[] | undefined;

  async getRestaurantCategories(idRestaurant: number) {
    const res = await fetch('https://localhost:7287/api/category/GetRestaurantCategories/' + idRestaurant, {
      method: 'GET',
    });
    if (res.status == 200) {
      const resJson: Category[] = await res.json();
      this.categories = resJson;
    }
  }
}
