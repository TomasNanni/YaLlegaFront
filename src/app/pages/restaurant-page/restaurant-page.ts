import { ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
import { RestaurantService } from '../../services/restaurant-service';
import { Restaurant } from '../../interfaces/restaurant';
import { Spinner } from "../../spinner/spinner/spinner";
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { CategoryService } from '../../services/category-service';
import { CategoryItem } from "../../components/category-item/category-item";
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-restaurant-page',
  imports: [Spinner, RouterLink, CategoryItem],
  templateUrl: './restaurant-page.html',
  styleUrl: './restaurant-page.scss',
})
export class RestaurantPage implements OnInit {
  idRestaurant = input.required<number>();
  restaurantService = inject(RestaurantService);
  restaurant: Restaurant | undefined;
  loadingRestaurant = signal<boolean>(false);
  cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  categoryService = inject(CategoryService);
  isOwner = false;
  newCategory : Category = {
    id : 0,
    name: "Nueva categoria",
    description: "Crear una categoria nueva",
    products : [],
  };

  async ngOnInit() {
    this.categoryService.categories = [];
    if (this.idRestaurant()) {
      this.restaurant = this.restaurantService.restaurants().find(restaurant => restaurant.id === this.idRestaurant());
      if (!this.restaurant) {
        this.loadingRestaurant.set(true);
      }
      const res = await this.restaurantService.getRestaurantById(this.idRestaurant());
      if (res) {
        this.isOwner = await this.auth.validateOwner(this.idRestaurant());
        this.restaurant = res;
        await this.categoryService.getRestaurantCategories(this.idRestaurant());
        if (this.categoryService.categories.length !== 0) {
          this.categoryService.getStandoutCategory();
        }
      }
      this.loadingRestaurant.set(false);
    }
  }
}
