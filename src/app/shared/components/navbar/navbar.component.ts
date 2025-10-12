import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { NewBuildingDialogComponent } from '../../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { NavElement } from '../../interfaces/nav-element.interface';
import { EntityDialogService } from '../../services/entity-dialog.service';
import { SidebarService } from '../../services/sidebar.service';
import { NavbarService } from './../../services/navbar.service';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDivider,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private _navbarService = inject(NavbarService);
  private _sidebarService = inject(SidebarService);
  private _entityDialogService = inject(EntityDialogService);
  private _router = inject(Router);

  items = input<NavElement[]>(this._navbarService.config());
  userLogged = this._navbarService.userLogged;
  sidebarOpened = this._sidebarService.isOpen;
  filtersOpened = computed(() => this._navbarService.filtersOpen());
  navbarDisabled = computed(() => this._navbarService.disabled());
  propertyDetailsOpened = signal(false);
  buildingDetailsOpened = signal(false);

  isHomePage = computed(() => {
    const route = this.currentRoute();
    return route === '/home' || route === '/';
  });

  showFilters = computed(
    () =>
      this.filtersOpened() &&
      this.isHomePage() &&
      !this.sidebarOpened() &&
      !this.propertyDetailsOpened() &&
      !this.buildingDetailsOpened()
  );

  currentRoute = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._router.url),
      startWith(this._router.url)
    ),
    { initialValue: this._router.url }
  );

  toggleSidebar() {
    this._sidebarService.toggle();
  }

  handlePublish() {
    if (!this.userLogged()) {
      this._router.navigate(['/auth/login']);
      return;
    }
  }

  publishBuilding() {
    this._entityDialogService
      .openNewEntityDialog(NewBuildingDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'building',
      })
      .subscribe();
  }

  handleMyAccount() {
    this._router.navigate(['/users/my-account']);
  }

  handleLogout() {
    this._navbarService.handleLogout();
  }

  get username() {
    return this._navbarService.username();
  }
}
