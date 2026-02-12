import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ngOnInit(): void {
    // Si tengo sesion iniciada reviso que no este vencida
    if (this.token) {
      this.revisionTokenInterval = this.revisionToken()
    }
  }

  token: null | string = localStorage.getItem("token");
  router = inject(Router);
  revisionTokenInterval: number | undefined;

  async login(loginData: LoginData) {
    const res = await fetch('https://localhost:7287/api/Authentication/authenticate',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData),
      }
    )
    console.log(res)
    if (res.ok) {
      const resText = await res.text()
      this.token = resText;
      localStorage.setItem("token", this.token);
      this.revisionTokenInterval = this.revisionToken()
    }
    return res.ok;
  }

  logout() {
    localStorage.removeItem("token");
    this.token = null;
    this.router.navigate(["/"]);
    if(this.revisionTokenInterval) clearInterval(this.revisionTokenInterval);
  }

    /** Revisa cada 10 minutos que el token siga siendo valido */
  revisionToken() {
    return setInterval(() => {
      if (this.token) {
        const base64Url = this.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const claims: { exp: number } = JSON.parse(jsonPayload);
        if (new Date(claims.exp * 1000) < new Date()) {
          this.logout()
        }
      }
    }, 600)
  }
}
