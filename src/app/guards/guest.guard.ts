import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token) {
    const redirectPath = router.parseUrl("/");
    return new RedirectCommand(redirectPath, {
      skipLocationChange: true,
    });
  }

  return true;
};
