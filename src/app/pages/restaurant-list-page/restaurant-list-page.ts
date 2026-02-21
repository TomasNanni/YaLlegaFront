import { Component, inject, OnInit } from '@angular/core';
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";
import { RouterLink } from "@angular/router";
import { RestaurantService } from '../../services/restaurant-service';
import { Spinner } from "../../spinner/spinner/spinner";

@Component({
  selector: 'app-restaurant-list-page',
  imports: [TopBarLayout, RouterLink, Spinner],
  templateUrl: './restaurant-list-page.html',
  styleUrl: './restaurant-list-page.scss',
})
export class RestaurantListPage implements OnInit {
  restaurantsService = inject(RestaurantService);

  ngOnInit(): void {
    this.restaurantsService.getRestaurants();
  }
}
