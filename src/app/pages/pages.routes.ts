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
    path: 'register',
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
