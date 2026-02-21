import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Restaurant } from '../interfaces/restaurant';
import { UserRegistrationRequest } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  authService = inject(AuthService)

  restaurants = signal<Restaurant[]>([]);
  restaurantsLoading = signal<boolean>(true);

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
    if (res.status == 200) {
      const resJson: Restaurant[] = await res.json();
      resJson.sort((restaurant1, restaurant2) => restaurant1.name.localeCompare(restaurant2.name))
      this.restaurants.set(resJson);
    }
    this.restaurantsLoading.set(false);
  }
  async getRestaurantById(idRestaurant: number) {
    const res = await fetch('https://localhost:7287/api/restaurants/GetOneById/' + idRestaurant, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      },
    });
    if (res.ok) {
      const resJson: Restaurant = await res.json();
      return resJson;
    }
    return null;
  }
}
