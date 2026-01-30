import { Routes } from '@angular/router';
import { UserGuard } from '../shared/guards/user.guard';

export const routes: Routes = [
  {
    path: 'my-account',
    loadComponent: () =>
      import('./pages/user-account/user-account.component').then(
        (m) => m.UserAccountComponent,
      ),
    canActivate: [UserGuard],
  },
  {
    path: '**',
    redirectTo: 'my-account',
  },
];
