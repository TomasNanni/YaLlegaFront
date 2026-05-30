import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
 * Guard para guests (usuarios no logueados).
 * Bloquea el acceso a rutas de creación/edición de productos y categorías.
 * Si no hay token, redirige al login.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token) {
    const redirectPath = router.parseUrl('/login');
    return new RedirectCommand(redirectPath, {
      skipLocationChange: true,
    });
  }

  return true;
};
