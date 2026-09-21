import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { NavbarService } from '../../services/navbar.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
})
export class SidebarComponent {
  private _router = inject(Router);
  private _sidebarService = inject(SidebarService);
  private _authService = inject(AuthService);
  private _navbarService = inject(NavbarService);
  private _breakpointService = inject(BreakpointService);

  userLogged = computed(() => this._authService.user());
  config = computed(() => this._sidebarService.config());
  navbarItems = computed(() => this._navbarService.config());
  menuOpen = computed(() => this._sidebarService.isOpen());
  isMobile = this._breakpointService.isMobile;

  navigate(route: string) {
    this._router.navigateByUrl(route);
    this._sidebarService.close();
  }

  logout() {
    this._authService.logout();
    this._sidebarService.close();
    this._router.navigate(['/auth/login']);
  }

  closeMenu() {
    this._sidebarService.close();
  }
}
