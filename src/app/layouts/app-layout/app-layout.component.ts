import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
})
export class AppLayoutComponent {
  navElements = [
    { name: 'Markers', url: '/demo/markers' },
    { name: 'Address', url: '/demo/address' },
    { name: 'User Position', url: '/demo/user-position' },
  ];
}
