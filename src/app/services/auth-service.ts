import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: null | string = localStorage.getItem("token");
  idCart: null | string = localStorage.getItem("idCart");
  router = inject(Router);
  revisionTokenInterval: number | undefined;

  constructor() {
    if (this.token) {
      this.revisionTokenInterval = this.revisionToken();
    }
  }

  async login(loginData: LoginData) {
    const res = await fetch('https://localhost:7287/api/Authentication/authenticate',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData),
      }
    );
    if (res.ok) {
      const resText = await res.text();
      this.token = resText;
      localStorage.setItem("token", this.token);
      this.revisionTokenInterval = this.revisionToken();
    }
    return res.ok;
  }

  logout() {
    localStorage.removeItem("token");
    this.token = null;
    this.router.navigate(["/"]);
    if (this.revisionTokenInterval) clearInterval(this.revisionTokenInterval);
  }

  /** Revisa cada 10 minutos que el token siga siendo valido */
  revisionToken() {
    return setInterval(() => {
      if (this.token) {
        const claims = this.decodeToken();
        if (claims && new Date(claims['exp'] * 1000) < new Date()) {
          this.logout();
        }
      }
    }, 600000);
  }

  async validateOwner(restaurantId: number) {
    const res = await fetch('https://localhost:7287/api/Authentication/validateOwner/' + restaurantId,
      {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      });
    return res.ok;
  }

  /** Extrae el ID del restaurante del token JWT */
  getRestaurantIdFromToken(): number | null {
    if (!this.token) return null;

    const claims = this.decodeToken();
    if (!claims) return null;
    const restaurantId = claims['nameid'] || claims['sub'] || null;
    return restaurantId ? parseInt(restaurantId) : null;
  }

  private decodeToken(): Record<string, any> | null {
    if (!this.token) return null;
    try {
      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
