import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routes').then((m) => m.routes),
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
