import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.routes),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
