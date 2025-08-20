import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { Role } from '../../auth/enums/role.enum';
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

  config = computed((): NavElement[] => {
    const status = this._authService.status();
    const user = this._authService.user();
    return NAVBAR_ITEMS[
      status === AuthStatus.AUTHENTICATED
        ? user?.role === Role.OWNER
          ? 'owner_logged'
          : 'tenant_logged'
        : 'unlogged'
    ];
  });

  disabled = computed(() => this._dialogStateService.isDialogOpen());
  userLogged = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED
  );
  username = computed(() => this._authService.user()?.username);

  handleLogin() {
    this._authService
      .login({
        email: 'esosa@gmail.com',
        password: 'password',
      })
      .subscribe();
  }
}
