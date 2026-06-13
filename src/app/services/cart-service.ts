import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  authService = inject(AuthService);

  async createCart(productId: number): Promise<number | null> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/Create/${productId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.authService.token,
        },
      }
    );
    if (!res.ok) return null;

    // El backend responde 201 con body: { Message: "El id del carrito creado es {id}" }
    const resJson = await res.json();
    const message: string = resJson?.Message;
    const match = message.match(/\d+$/);
    if (!match) return null;

    const cartId = parseInt(match[0]);
    localStorage.setItem('idCart', cartId.toString());
    this.authService.idCart = cartId.toString();
    return cartId;
  }

  async addProduct(cartId: number, productId: number): Promise<boolean> {
    const res = await fetch(
      `https://localhost:7287/api/Carts/AddProducts/${cartId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.authService.token,
        },
        body: JSON.stringify([productId]),
      }
    );
    return res.ok;
  }
}
