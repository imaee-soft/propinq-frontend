
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'favorites',
    loadComponent: () => import('./favorite-page/favorite-page.component').then(m => m.FavoritePageComponent),
  },
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
      import('../auth/pages/signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent
      ),
  },
  {
    path: 'auth/verify-email',
    loadComponent: () =>
      import('../auth/pages/verify-email-page/verify-email-page.component').then(
        (m) => m.VerifyEmailPageComponent
      ),
  },
  {
    path: 'auth/activate',
    loadComponent: () =>
      import('../auth/pages/account-activation-page/account-activation-page.component').then(
        (m) => m.AccountActivationPageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'buildings',
    loadComponent: () =>
      import('./building-page/building-page.component').then(
        (m) => m.BuildingPageComponent
      ),
  },
  {
    path: 'properties/:propertyId',
    loadComponent: () =>
      import('./property-details-page/property-details-page.component').then(
        (m) => m.PropertyDetailsPageComponent
      ),
  },
  {
    path: 'localities',
    loadComponent: () =>
      import('../localities/components/locality.component').then(
        (m) => m.LocalityComponent
      ),
  },
  {
    path: 'neighborhoods',
    loadComponent: () =>
      import('../neighborhoods/components/neighborhood.component').then(
        (m) => m.NeighborhoodComponent
      ),
  },
  {
    path: 'property-types',
    loadComponent: () =>
      import('../property-types/components/property-type.component').then(
        (m) => m.PropertyTypeComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard-router.component').then(
        (m) => m.DashboardRouterComponent
      ),
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./property-page/property-page.component').then(
        (m) => m.PropertyPageComponent
      ),
  },
  {
    path: 'mocks',
    loadComponent: () =>
      import(
        '../shared/pages/mock-projects-page/mock-projects-page.component'
      ).then((m) => m.MockProjectsPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
