import { inject, Injectable, signal } from '@angular/core';
import { Category, NewEditCategoryI } from '../interfaces/category';
import { AuthService } from './auth-service';
import { ProductDetailsI } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  categories = signal<Category[]>([]);
  standoutCategory = signal<Category | undefined>(undefined);
  authService = inject(AuthService);

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
  async deleteCategory(idCategory: number) {
    const res = await fetch('https://localhost:7287/api/category/Delete/' + idCategory,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.authService.token,
        },
      });
    if (!res.ok) return;
    const newCategories= this.categories().filter(category => category.id !== idCategory);
    this.categories.set(newCategories);
    return true;
  }

  async editCategory(category: NewEditCategoryI, idCategory: number) {
    const updatedCategory = {
      name: category.name,
      description: category.description,
      productsId: category.productsId
    };
    const res = await fetch("https://localhost:7287/api/category/Update/" + idCategory, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.authService.token,
      },
      body: JSON.stringify(updatedCategory),
    });
    if (!res.ok) {
      return;
    }
    return res;
  }

  getStandoutCategory() {
    const standoutProducts: ProductDetailsI[] = [];
    this.categories().forEach(category => {
      category.products.forEach(product => {
        if (product.isStandout == true) {
          standoutProducts.push(product);
        }
      });
    });
    if (standoutProducts.length > 0) {
      this.standoutCategory.set({
        id: 0,
        name: "Destacados",
        description: "Nuestros mejores productos",
        products: standoutProducts
      });
    } else {
      this.standoutCategory.set(undefined);
    }
  }

  async getRestaurantCategories(idRestaurant: number) {
    const res = await fetch('https://localhost:7287/api/category/GetRestaurantCategories/' + idRestaurant, {
      method: 'GET',
    });
    if (res.status == 200) {
      const resJson: Category[] = await res.json();
      this.categories.set(resJson);
    }
  }

  async createCategory(newCategory: NewEditCategoryI  ) {
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
    this.categories.update(cats => [...cats, resCategory]);
    return res;
  }
}
