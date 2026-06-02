import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
 * Guard para dueños (usuarios con rol owner).
 * - Sin token: permite el acceso (guests pueden ver lista de restaurantes, login, etc.)
 * - Con token: valida que el restaurante en la ruta le pertenezca al owner.
 * - Si no es propietario del restaurante, redirige a su propio restaurante.
 */
export const authOwnerGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Sin token: el usuario es un guest, puede acceder libremente
  if (!authService.token) {
    return true;
  }

  // Obtener el idRestaurant de los parámetros de la ruta
  const idRestaurant = route.paramMap.get('idRestaurant');

  // Obtener el restaurantId del token
  const restaurantId = authService.getRestaurantIdFromToken();

  if (idRestaurant) {
    // Validar que el usuario es propietario del restaurante
    const isOwner = await authService.validateOwner(parseInt(idRestaurant));

    if (!isOwner) {
      // Si no es propietario, redirigir a su propio restaurante
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
