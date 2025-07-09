import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import(
        './dialogs/new-building-dialog/new-building-dialog.component'
      ).then((m) => m.NewBuildingPageComponent),
  },
  {
    path: '**',
    redirectTo: 'new',
  },
];
