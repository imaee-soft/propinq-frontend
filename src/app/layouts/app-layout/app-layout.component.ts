import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: 'app-layout.component.html',
  styleUrl: 'app-layout.component.css',
})
export class LayoutComponent {}
