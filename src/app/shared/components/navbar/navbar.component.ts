import { Component, HostListener, input, signal } from '@angular/core';
import { NavElement } from '../../interfaces/nav-element.interface';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  imports: [SidebarComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  sidebarOpen = signal(false);


}
