import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RedirectCommand } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authOwnerGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no hay token, no está logeado - redirigir a landing page
  if (!authService.token) {
    const redirectPath = router.parseUrl("/");
    return new RedirectCommand(redirectPath, {
      skipLocationChange: true,
    });
  }

  // Obtener el idRestaurant de los parámetros de la ruta
  const idRestaurant = route.paramMap.get('idRestaurant');

  if (idRestaurant) {
    // Validar que el usuario es propietario del restaurante
    const isOwner = await authService.validateOwner(parseInt(idRestaurant));
    
    if (!isOwner) {
      // Si no es propietario, redirigir a su restaurante desde el token
      const restaurantId = authService.getRestaurantIdFromToken();
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
  }

  return true;
};
