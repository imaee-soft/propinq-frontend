import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { AuthService } from '../../auth/services/auth.service';
import { NavElement } from '../interfaces/nav-element.interface';
import { OWNER_NAVBAR_ITEMS } from '../utilities/owner.config';
import { TENANT_NAVBAR_ITEMS } from '../utilities/tenant.config';
import { UNLOGGED_NAVBAR_ITEMS } from '../utilities/unlogged.config';
import { DialogStateService } from './dialog-state.service';

const NAVBAR_ITEMS: Record<string, NavElement[]> = {
  unlogged: UNLOGGED_NAVBAR_ITEMS,
  tenant_logged: TENANT_NAVBAR_ITEMS,
  owner_logged: OWNER_NAVBAR_ITEMS,
};

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private _authService = inject(AuthService);
  private _dialogStateService = inject(DialogStateService);

  user = this._authService.user;
  status = this._authService.status;

  filtersOpen = signal(true);
  config = computed((): NavElement[] => {
    const status = this._authService.status();
    const user = this._authService.user();
    return NAVBAR_ITEMS[
      status === AuthStatus.AUTHENTICATED
        ? user?.role.toString() === 'OWNER'
          ? 'owner_logged'
          : 'tenant_logged'
        : 'unlogged'
    ];
  });

  disabled = computed(() => this._dialogStateService.isDialogOpen());
  userLogged = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED,
  );
  username = computed(() => this._authService.user()?.username);
  userId = computed(() => this._authService.user()?.userId);
  isOwner = computed(() => {
    const user = this._authService.user();
    return user?.role.toString() === 'OWNER';
  });
  isTenant = computed(() => {
    const user = this._authService.user();
    return user?.role.toString() === 'TENANT';
  });

  handleLogout() {
    this._authService.logout();
  }

  toggleFilters(): void {
    this.filtersOpen.set(!this.filtersOpen());
  }

  openFilters(): void {
    this.filtersOpen.set(true);
  }

  closeFilters(): void {
    this.filtersOpen.set(false);
  }
}
