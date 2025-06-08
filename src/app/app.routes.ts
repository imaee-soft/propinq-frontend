import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'demo',
        loadChildren: () => import('./demo/demo.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: 'demo',
      },
    ],
  },
];
