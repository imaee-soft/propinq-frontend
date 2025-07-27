import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home-page',
    loadComponent: () =>
      import('./home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'property-types',
    loadComponent: () =>
      import('../propertyType/components/property-type-crud.component').then(
        (m) => m.PropertyTypeCrudComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home-page',
  },
];
