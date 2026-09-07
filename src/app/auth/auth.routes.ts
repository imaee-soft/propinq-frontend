import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login-page/login-page.routes').then((m) => m.routes),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent,
      ),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/verify-email-page/verify-email-page.component').then(
        (m) => m.VerifyEmailPageComponent,
      ),
  },
  {
    path: 'activate',
    loadComponent: () =>
      import(
        './pages/account-activation-page/account-activation-page.component'
      ).then((m) => m.AccountActivationPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './pages/forgot-password-page/forgot-password-page.component'
      ).then((m) => m.ForgotPasswordPageComponent),
  },
  {
    path: 'recover-password',
    loadComponent: () =>
      import(
        './pages/recover-password-page/recover-password-page.component'
      ).then((m) => m.RecoverPasswordPageComponent),
  },
];
