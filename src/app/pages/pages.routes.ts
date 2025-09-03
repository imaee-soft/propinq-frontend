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
    path: 'buildings',
    loadComponent: () =>
      import('./building-page/building-page.component').then(
        (m) => m.BuildingPageComponent
      ),
  },
  {
    path: 'properties/:propertyId',
    loadComponent: () =>
      import('./property-page/property-page.component').then(
        (m) => m.PropertyPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
