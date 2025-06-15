import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AuthStatus } from '../../../auth/enums/auth-status.enum';
import { AuthService } from '../../../auth/services/auth.service';
import { NavElement } from '../../interfaces/nav-element.interface';
import { NavbarService } from '../../services/navbar.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDivider,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private _navbarService = inject(NavbarService);
  private _authService = inject(AuthService);
  private _sidebarService = inject(SidebarService);

  items = input<NavElement[]>(this._navbarService.config());

  isSidebarOpen = this._sidebarService.isOpen;
  user = this._authService.user;

  userLogged = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED
  );

  fullName = computed(() => {
    const user = this._authService.user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  toggleSidebar() {
    this._sidebarService.toggle();
  }
}
