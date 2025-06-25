import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/new-building-dialog/new-building-dialog.component').then(
        (m) => m.NewBuildingPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'new',
  },
];
