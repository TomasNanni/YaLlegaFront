import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { Restaurant } from '../interfaces/restaurant';
import { UserRegistrationRequest } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  authService = inject(AuthService)

  restaurants : Restaurant [] = [];

  async register(registrationRequest: UserRegistrationRequest) {
    const res = await fetch('https://localhost:7287/api/users/Create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(registrationRequest),
    });
    return res;
  }
  async getRestaurants() {
    const res = await fetch('https://localhost:7287/api/restaurants/GetAll', {
      method: 'GET',
    });
    if (res.ok){
      const resJson : Restaurant[] = await res.json();
      resJson.sort((restaurant1, restaurant2) => restaurant1.name.localeCompare(restaurant2.name))
      this.restaurants = resJson;
    }
  }
}
