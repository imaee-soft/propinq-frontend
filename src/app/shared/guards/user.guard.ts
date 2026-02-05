import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const UserGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  if (1 == 1) return true;

  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.user();
  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
