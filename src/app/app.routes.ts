import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/pages-layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
