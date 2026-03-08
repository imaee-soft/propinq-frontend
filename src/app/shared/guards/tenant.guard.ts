import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { AuthService } from '../../auth/services/auth.service';

export const TenantGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return toObservable(authService.status).pipe(
    filter((status) => status !== AuthStatus.PENDING),
    take(1),
    map(() => {
      const user = authService.user();

      if (!user) {
        return router.createUrlTree(['/auth/login']);
      }

      if (user.role.toString() !== 'TENANT') {
        return router.createUrlTree(['/']);
      }

      return true;
    }),
  );
};
