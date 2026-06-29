import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { CartProductI } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  authService = inject(AuthService);

  async createCart(productIds: number[]): Promise<number | null> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/Create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.authService.token,
        },
        body: JSON.stringify(productIds),
      }
    );
    if (!res.ok) return null;

    // El backend responde 201 con body: { Message: "El id del carrito creado es {id}" }
    const resJson = await res.json();
    const message: string | undefined = resJson?.Message ?? resJson?.message;
    if (!message) return null;
    const match = message.match(/\d+$/);
    if (!match) return null;

    const cartId = parseInt(match[0]);
    localStorage.setItem('idCart', cartId.toString());
    this.authService.idCart = cartId.toString();
    return cartId;
  }

  async addProduct(cartId: number, productIds: number[]): Promise<boolean> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/AddProducts/${cartId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.authService.token,
        },
        body: JSON.stringify(productIds),
      }
    );
    return res.ok;
  }

  async getCart(cartId: number): Promise<CartProductI[] | null> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/GetOneByid/${cartId}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.authService.token,
        },
      }
    );
    if (!res.ok) return null;
    const resJson: CartProductI[] = await res.json();
    return resJson;
  }

  async deleteProduct(cartId: number, productIds: number[]): Promise<boolean> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/DeleteProducts/${cartId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.authService.token,
        },
        body: JSON.stringify(productIds),
      }
    );
    return res.ok;
  }

  async deleteCart(cartId: number): Promise<boolean> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/Delete/${cartId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + this.authService.token,
        },
      }
    );
    if (res.ok) {
      localStorage.removeItem('idCart');
      this.authService.idCart = null;
    }
    return res.ok;
  }
}
