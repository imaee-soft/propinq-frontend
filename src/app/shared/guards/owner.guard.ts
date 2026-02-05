import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const OwnerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  if (1 == 1) return true;

  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.user();
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (user?.role.toString() !== 'OWNER') {
    return router.createUrlTree(['/']);
  }

  return true;
};
