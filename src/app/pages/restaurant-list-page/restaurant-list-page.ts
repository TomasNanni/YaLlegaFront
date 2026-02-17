import { Component, inject } from '@angular/core';
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";
import { RouterLink } from "@angular/router";
import { RestaurantService } from '../../services/restaurant-service';

@Component({
  selector: 'app-restaurant-list-page',
  imports: [TopBarLayout, RouterLink],
  templateUrl: './restaurant-list-page.html',
  styleUrl: './restaurant-list-page.scss',
})
export class RestaurantListPage {
  restaurantsService = inject(RestaurantService);

  ngOnInit(): void {
    this.restaurantsService.getRestaurants();
  }
}
