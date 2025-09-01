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
    path: '**',
    redirectTo: '',
  },
];
