import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
 * Guard para dueños (usuarios con rol owner).
 * - Bloquea el acceso a register, login y la lista de restaurantes.
 * - Si hay token, valida que el restaurante en la ruta le pertenezca.
 * - Sin token, redirige a la landing page.
 */
export const authOwnerGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no hay token, redirigir a landing page
  if (!authService.token) {
    const redirectPath = router.parseUrl('/');
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
      // Si no es propietario, redirigir a su propio restaurante
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
