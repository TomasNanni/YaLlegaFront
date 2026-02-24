import { inject, Injectable } from '@angular/core';
import { Category, NewEditCategoryI } from '../interfaces/category';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  async getCategoryById(idCategory: number) {
    const res = await fetch('https://localhost:7287/api/category/GetOneById/' + idCategory, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      },
    });
    if (res.ok) {
      const resJson: Category = await res.json();
      return resJson;
    }
    return null;
  }
  async editCategory(category : NewEditCategoryI, idCategory : number){
    throw new Error('Method not implemented.');
  }
  categories: Category[] = [];
  authService = inject(AuthService);

  async getRestaurantCategories(idRestaurant: number) {
    const res = await fetch('https://localhost:7287/api/category/GetRestaurantCategories/' + idRestaurant, {
      method: 'GET',
    });
    if (res.status == 200) {
      const resJson: Category[] = await res.json();
      this.categories = resJson;
    }
  }

  async createCategory(newCategory: NewEditCategoryI) {
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
    return res;
  }
}
