import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/enums/auth-status.enum';
import { SideConfig } from '../../interfaces/side-config.interface';
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

  config = input<SideConfig>(this._sidebarService.config());

  isOpen = computed(
    () =>
      this._sidebarService.isOpen() &&
      this._authService.status() === AuthStatus.AUTHENTICATED
  );
  sidenavWidth = computed(() => (this._sidebarService.isOpen() ? 320 : 0));

  navigate(route: string) {
    this._router.navigateByUrl(route);
  }

  logout() {
    this._authService.logout();
  }
}
