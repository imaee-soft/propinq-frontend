import { inject, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { AuthService } from '../../auth/services/auth.service';
import { SideConfig } from '../interfaces/side-config';

const SIDEBAR_ITEMS: Record<string, SideConfig> = {
  unlogged: {
    enabled: false,
    items: [],
  },
  tenant_logged: {
    enabled: true,
    items: [
      {
        label: 'Mi alquiler',
        icon: 'apartment',
        route: '/home',
      },
      {
        label: 'Mis solicitudes de contacto',
        icon: 'chat',
        route: '/home',
      },
      {
        label: 'Mis favoritos',
        icon: 'favorite',
        route: '/home',
      },
      {
        label: 'Mis puntos de interés',
        icon: 'bookmark',
        route: '/home',
      },
      {
        label: 'Mis contactos',
        icon: 'person',
        route: '/home',
      },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _authService = inject(AuthService);
  private _isOpen = signal(false);

  config = signal<SideConfig>(
    SIDEBAR_ITEMS[
      this._authService.status() === AuthStatus.AUTHENTICATED
        ? 'tenant_logged'
        : 'unlogged'
    ]
  );
  isOpen = this._isOpen.asReadonly();

  toggle() {
    this._isOpen.set(!this._isOpen());
  }
}
