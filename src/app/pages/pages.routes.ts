import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'auth-wall-page',
    loadComponent: () =>
      import('./auth-wall-page/auth-wall-page.component').then(
        (m) => m.AuthWallPageComponent
      ),
  },
  {
    path: 'register-page',
    loadComponent: () =>
      import('./register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
