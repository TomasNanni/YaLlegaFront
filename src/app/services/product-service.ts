import { inject, Injectable } from '@angular/core';
import { NewEditProductI, ProductDetailsI } from '../interfaces/product';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  authService = inject(AuthService);

  async editProduct(editProduct: NewEditProductI, idProduct: number) {
    const res = await fetch("https://localhost:7287/api/products/Update" + idProduct, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.authService.token,
      },
      body: JSON.stringify(editProduct),
    });
    if (!res.ok) {
      return;
    }
    return res;
  }
  async createProduct(formProduct: NewEditProductI) {
    const res = await fetch('https://localhost:7287/api/products/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(formProduct),
    });
    if (!res.ok) return;
    return res;
  }

  async getProductById(idProduct: number) {
    const res = await fetch('https://localhost:7287/api/products/GetOneById/' + idProduct, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      }
    });
    if (res.ok) {
      const resJson: ProductDetailsI = await res.json();
      return resJson;
    }
    return null;
  }

}
