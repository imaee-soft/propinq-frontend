import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.routes),
      },
      {
        path: 'buildings',
        loadChildren: () =>
          import('./buildings/buildings.routes').then((m) => m.routes),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];
