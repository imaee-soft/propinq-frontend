import { Routes } from '@angular/router';
import { AddressPageComponent } from './pages/address-page/address-page.component';
import { MarkersPageComponent } from './pages/markers-page/markers-page.component';

export const routes: Routes = [
  {
    path: 'markers',
    component: MarkersPageComponent,
  },
  {
    path: 'address',
    component: AddressPageComponent,
  },
  {
    path: '**',
    redirectTo: 'markers',
  },
];
