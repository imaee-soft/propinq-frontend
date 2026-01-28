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

  userLogged = computed(() => this._authService.user());
  config = computed(() => this._sidebarService.config());
  sidenavWidth = computed(() => (this._sidebarService.isOpen() ? 320 : 0));
  isDashboardPage = computed(() => this._sidebarService.isDashboardPage());

  navigate(route: string) {
    this._router.navigateByUrl(route);
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/auth/login']);
  }
}
