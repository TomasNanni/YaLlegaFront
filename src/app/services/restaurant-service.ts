import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { NewRestaurant, NewUser, UserRegistrationRequest } from '../interfaces/restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  authService = inject(AuthService)

  async register(registrationRequest : UserRegistrationRequest) {
    const res = await fetch('https://localhost:7287/api/users/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(registrationRequest),
    });
    return res.ok;
  }
}
