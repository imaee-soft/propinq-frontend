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
    path: '**',
    redirectTo: '',
  },
];
