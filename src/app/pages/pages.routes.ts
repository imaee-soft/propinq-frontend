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
    path: 'signup',
    loadComponent: () =>
      import('./signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent
      ),
  },
  {
    path: 'account-activation',
    loadComponent: () =>
      import('./account-activation-page/account-activation-page.component').then(
        (m) => m.AccountActivationPageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
