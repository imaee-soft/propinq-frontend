import { inject, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { AuthService } from '../../auth/services/auth.service';
import { NavElement } from '../interfaces/nav-element.interface';

const NAVBAR_ITEMS: Record<string, NavElement[]> = {
  unlogged: [],
  tenant_logged: [
    {
      name: 'Publicar',
      url: '/',
      featured: true,
    },
    {
      name: 'Favoritos',
      url: '/',
    },
    {
      name: 'Intereses',
      url: '/',
    },
    {
      name: 'Contactos',
      url: '/',
    },
    {
      name: 'Ayuda',
      url: '/',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private _authService = inject(AuthService);

  config = signal<NavElement[]>(
    NAVBAR_ITEMS[
      this._authService.status() === AuthStatus.AUTHENTICATED
        ? 'tenant_logged'
        : 'unlogged'
    ]
  );
}
