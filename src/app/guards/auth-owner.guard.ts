import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authOwnerGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token) {
    return true;
  }

  const idRestaurant = route.paramMap.get('idRestaurant');
  const restaurantId = authService.getRestaurantIdFromToken();

  if (idRestaurant) {
    const isOwner = await authService.validateOwner(parseInt(idRestaurant));

    if (!isOwner) {
      if (restaurantId) {
        const redirectPath = router.parseUrl(`/restaurant/${restaurantId}`);
        return new RedirectCommand(redirectPath, {
          skipLocationChange: true,
        });
      } else {
        router.navigate(['/']);
      }
      return false;
    }
  } else if (restaurantId) {
    const redirectPath = router.parseUrl(`/restaurant/${restaurantId}`);
    return new RedirectCommand(redirectPath, { skipLocationChange: false });
  }

  return true;
};
