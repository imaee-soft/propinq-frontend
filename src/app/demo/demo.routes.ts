import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'markers',
    loadComponent: () =>
      import('./pages/markers-page/markers-page.component').then(
        (m) => m.MarkersPageComponent
      ),
  },
  {
    path: 'address',
    loadComponent: () =>
      import('./pages/address-page/address-page.component').then(
        (m) => m.AddressPageComponent
      ),
  },
  {
    path: 'user-position',
    loadComponent: () =>
      import('./pages/user-position-page/user-position-page.component').then(
        (m) => m.UserPositionPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'markers',
  },
];
