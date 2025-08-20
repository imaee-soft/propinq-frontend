import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'my-account',
    loadComponent: () =>
      import('./pages/user-account/user-account.component').then(
        (m) => m.UserAccountComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'my-account',
  },
];
