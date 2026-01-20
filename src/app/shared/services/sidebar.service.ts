import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { AuthService } from '../../auth/services/auth.service';
import { OWNER_SIDEBAR_CONFIG } from '../utilities/owner.config';
import { TENANT_SIDEBAR_CONFIG } from '../utilities/tenant.config';
import { UNLOGGED_SIDEBAR_CONFIG } from '../utilities/unlogged.config';
import { SideConfig } from './../interfaces/side-config.interface';

const SIDEBAR_ITEMS: Record<string, SideConfig> = {
  unlogged: UNLOGGED_SIDEBAR_CONFIG,
  tenant_logged: TENANT_SIDEBAR_CONFIG,
  owner_logged: OWNER_SIDEBAR_CONFIG,
};

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private router = inject(Router);
  private _authService = inject(AuthService);
  private _isOpen = signal(false);

  config = computed((): SideConfig => {
    const status = this._authService.status();
    const user = this._authService.user();
    return SIDEBAR_ITEMS[
      status === AuthStatus.AUTHENTICATED
        ? user?.role.toString() === 'OWNER'
          ? 'owner_logged'
          : 'tenant_logged'
        : 'unlogged'
    ];
  });

  isOpen = this._isOpen.asReadonly();

  toggle() {
    this._isOpen.set(!this._isOpen());
  }

  urlSignal = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  isDashboardPage = computed(() => {
    return this.urlSignal().includes('/dashboard');
  });
  isMapPage = computed(() => {
    return this.urlSignal() === '/';
  });

  isOnAnyPage = computed(() => {
    return this.urlSignal() !== '/' && !this.urlSignal().includes('/dashboard');
  });
}
