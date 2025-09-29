import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
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
import { NewBuildingDialogComponent } from '../../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { NavElement } from '../../interfaces/nav-element.interface';
import { EntityDialogService } from '../../services/entity-dialog.service';
import { NavbarService } from '../../services/navbar.service';
import { SidebarService } from '../../services/sidebar.service';
import { NavbarFiltersComponent } from "../navbar-filters/navbar-filters.component";
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
    NavbarFiltersComponent
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
  navbarDisabled = computed(() => this._navbarService.disabled());
  currentRoute = toSignal(
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this._router.url),
      startWith(this._router.url)
    ),
    { initialValue: this._router.url }
  );

  isHomePage = computed(() => {
    const route = this.currentRoute();
    console.log('Current route:', route);
    return route === '/home' || route === '/';
  });
  toggleSidebar() {
    this._sidebarService.toggle();
  }

  handleLogin() {
    this._navbarService.handleLogin();
  }

  handleNavItemClick(item: NavElement, event: Event) {
    if (item.featured) {
      event.preventDefault();
      this._entityDialogService
        .openNewEntityDialog(NewBuildingDialogComponent, {
          panelClass: 'generic-dialog',
          entity: 'building',
          
        })
        .subscribe();
    }
  }

  handleMyAccount() {
    this._router.navigate(['/users/my-account']);
  }

  get username() {
    return this._navbarService.username();
  }

  showFilters() {
    return this._navbarService.showFilters();
  }
}
