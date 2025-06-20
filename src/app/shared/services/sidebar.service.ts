import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { Role } from '../../auth/enums/role.enum';
import { AuthService } from '../../auth/services/auth.service';
import { SideConfig } from '../interfaces/side-config';
import { OWNER_SIDEBAR_CONFIG } from '../utilities/owner.config';
import { TENANT_SIDEBAR_CONFIG } from '../utilities/tenant.config';
import { UNLOGGED_SIDEBAR_CONFIG } from '../utilities/unlogged.config';

const SIDEBAR_ITEMS: Record<string, SideConfig> = {
  unlogged: UNLOGGED_SIDEBAR_CONFIG,
  tenant_logged: TENANT_SIDEBAR_CONFIG,
  owner_logged: OWNER_SIDEBAR_CONFIG,
};

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _authService = inject(AuthService);
  private _isOpen = signal(false);

  config = computed((): SideConfig => {
    const status = this._authService.status();
    const user = this._authService.user();
    return SIDEBAR_ITEMS[
      status === AuthStatus.AUTHENTICATED
        ? user?.role === Role.OWNER
          ? 'owner_logged'
          : 'tenant_logged'
        : 'unlogged'
    ];
  });

  isOpen = this._isOpen.asReadonly();

  toggle() {
    this._isOpen.set(!this._isOpen());
  }
}
