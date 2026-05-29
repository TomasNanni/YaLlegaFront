import { Component, OnInit, inject } from '@angular/core';
import { TopBarLayout } from "../../layout/layout/top-bar-layout/top-bar-layout";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-landing-page',
  imports: [TopBarLayout, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    // Si el usuario está logeado, redirigir a su restaurant page
    if (this.authService.token) {
      const restaurantId = this.authService.getRestaurantIdFromToken();
      if (restaurantId) {
        this.router.navigate(['/restaurant', restaurantId]);
      }
    }
  }
}
