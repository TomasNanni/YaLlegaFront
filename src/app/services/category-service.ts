import { inject, Injectable } from '@angular/core';
import { Category, NewCategory } from '../interfaces/category';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories: Category[] = [];
  authService = inject(AuthService);
  categoryNew: Category = {
    id: 0,
    name: "Nueva categoria",
    description: "Crear una categoria nueva",
    products: []
  };

  async getRestaurantCategories(idRestaurant: number) {
    const res = await fetch('https://localhost:7287/api/category/GetRestaurantCategories/' + idRestaurant, {
      method: 'GET',
    });
    if (res.status == 200) {
      const resJson: Category[] = await res.json();
      this.categories = resJson;
    }
  }

  async createCategory(newCategory: NewCategory) {
    const res = await fetch("https://localhost:7287/api/category/Create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(newCategory),
    });
    if (!res.ok) return;
    const resCategory: Category = await res.json();
    this.categories.push(resCategory);
  }
}
