import { inject, Injectable } from '@angular/core';
import { Category, EditCategoryI, NewCategoryI } from '../interfaces/category';
import { AuthService } from './auth-service';
import { ProductDetailsI } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories: Category[] = [];
  standoutCategory: Category | undefined;
  authService = inject(AuthService);
  updatedCategory : EditCategoryI | undefined; 

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

  async editCategory(category: NewCategoryI, idCategory: number) {
    this.updatedCategory = {
      name : category.name,
      description: category.description,
      productsId: category.productsId
    }
    const res = await fetch("https://localhost:7287/api/category/Update/" + idCategory, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.authService.token,
      },
      body: JSON.stringify(this.updatedCategory),
    });
    if (!res.ok) {
      return;
    }
    return res;
  }

  getStandoutCategory() {
    const standoutProducts: ProductDetailsI[] = [];
    this.categories.forEach(category => {
      category.products.forEach(product => {
        if (product.isStandout == true) {
          standoutProducts.push(product);
        }
      });
    });
    if (standoutProducts.length > 0) {
      this.standoutCategory = {
        id: 0,
        name: "Destacados",
        description: "Nuestros mejores productos",
        products: standoutProducts
      };
    } else {
      this.standoutCategory = undefined;
    }
  }

  async getRestaurantCategories(idRestaurant: number) {
    const res = await fetch('https://localhost:7287/api/category/GetRestaurantCategories/' + idRestaurant, {
      method: 'GET',
    });
    if (res.status == 200) {
      const resJson: Category[] = await res.json();
      this.categories = resJson;
    }
  }

  async createCategory(newCategory: NewCategoryI) {
    const res = await fetch("https://localhost:7287/api/category/Create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(newCategory),
    });
    if (!res.ok) return null;
    const resCategory: Category = await res.json();
    this.categories.push(resCategory);
    return res;
  }
}
