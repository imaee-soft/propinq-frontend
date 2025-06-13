import { Component, HostListener, input, output, signal } from '@angular/core';
import { NavElement } from '../../interfaces/nav-element.interface';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  imports: [SidebarComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
 sidebarOpen = input<boolean>(false);   // ¡input, solo lectura!
  toggleSidebar = output<void>();        // output para pedir el toggle
}
