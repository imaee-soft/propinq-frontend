import { Component, inject, signal, computed } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [ NavbarComponent, SidebarComponent, RouterModule],
  templateUrl: 'app-layout.component.html',
  styleUrl: 'app-layout.component.css',
})
export class LayoutComponent {
  private _router = inject(Router);

  readonly url = signal(this._router.url);

  constructor() {
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.url.set(this._router.url);
      }
    });
  }

  readonly isAuthWall = computed(() => this.url() === '/auth-wall-page');
  readonly isRegister = computed(() => this.url() === '/register-page');
}
