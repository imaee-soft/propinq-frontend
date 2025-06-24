import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/new-building-page/new-building-page.component').then(
        (m) => m.NewBuildingPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'new',
  },
];
