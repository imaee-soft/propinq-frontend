import { Component} from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layout',
  imports: [ NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: 'app-layout.component.html',
  styleUrl: 'app-layout.component.css',
})
export class LayoutComponent {
}
