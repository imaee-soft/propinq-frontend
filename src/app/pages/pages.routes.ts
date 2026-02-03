import { Routes } from '@angular/router';
import { OwnerGuard } from '../shared/guards/owner.guard';
import { TenantGuard } from '../shared/guards/tenant.guard';
import { UserGuard } from '../shared/guards/user.guard';

export const routes: Routes = [
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorite-page/favorite-page.component').then(
        (m) => m.FavoritePageComponent,
      ),
    canActivate: [TenantGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../auth/pages/signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent,
      ),
  },
  {
    path: 'auth/verify-email',
    loadComponent: () =>
      import('../auth/pages/verify-email-page/verify-email-page.component').then(
        (m) => m.VerifyEmailPageComponent,
      ),
  },
  {
    path: 'auth/activate',
    loadComponent: () =>
      import('../auth/pages/account-activation-page/account-activation-page.component').then(
        (m) => m.AccountActivationPageComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'buildings',
    loadComponent: () =>
      import('./building-page/building-page.component').then(
        (m) => m.BuildingPageComponent,
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: 'buildings/:buildingId',
    loadComponent: () =>
      import('./building-details-page/building-details-page.component').then(
        (m) => m.BuildingDetailsPageComponent,
      ),
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./property-page/property-page.component').then(
        (m) => m.PropertyPageComponent,
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: 'properties/:propertyId',
    loadComponent: () =>
      import('./property-details-page/property-details-page.component').then(
        (m) => m.PropertyDetailsPageComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard-router.component').then(
        (m) => m.DashboardRouterComponent,
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: 'tenant-contacts',
    loadComponent: () =>
      import('./tenant-contacts-page/tenant-contacts-page.component').then(
        (m) => m.TenantContactsPageComponent,
      ),
    canActivate: [TenantGuard],
  },
  {
    path: 'owner-contacts',
    loadComponent: () =>
      import('./owner-contacts-page/owner-contacts-page.component').then(
        (m) => m.OwnerContactsPageComponent,
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports-page/reports-page.component').then(
        (m) => m.ReportsPageComponent,
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: 'contact-details/:contactId',
    loadComponent: () =>
      import('./contact-details-page/contact-details-page.component').then(
        (m) => m.ContactDetailsPageComponent,
      ),
    canActivate: [UserGuard],
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./help-page/help-page.component').then(
        (m) => m.HelpPageComponent,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications-page/notifications-page.component').then(
        (m) => m.NotificationsPageComponent,
      ),
    canActivate: [UserGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
