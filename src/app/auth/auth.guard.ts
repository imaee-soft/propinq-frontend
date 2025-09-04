import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthStatus } from './enums/auth-status.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const status = authService.status();

  if (status === AuthStatus.PENDING) {
    return false;
  }

  if (status === AuthStatus.AUTHENTICATED) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
