import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { UpdatedUser, User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authService = inject(AuthService);

  async getUser(idUser: number) {
    const res = await fetch('https://localhost:7287/api/Users/GetOneById/' + idUser, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      },
    });
    if (res.ok) {
      const resJson: User = await res.json();
      return resJson;
    }
    return null;
  }

  async updateUser(user: UpdatedUser) {
    const res = await fetch('https://localhost:7287/api/Users/Update/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      return;
    }
    return res;
  }

  async deleteUser() {
    const res = await fetch('https://localhost:7287/api/Users/Delete/', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      },
    });
    if (!res.ok) return;
    return true;
  }
}
