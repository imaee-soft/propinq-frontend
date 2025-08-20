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
import { Router, RouterModule } from '@angular/router';
import { NewBuildingDialogComponent } from '../../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { NavElement } from '../../interfaces/nav-element.interface';
import { EntityDialogService } from '../../services/entity-dialog.service';
import { NavbarService } from '../../services/navbar.service';
import { SidebarService } from '../../services/sidebar.service';

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
  navbarDisabled = computed(() => this._navbarService.disabled());

  toggleSidebar() {
    this._sidebarService.toggle();
  }

  handleLogin() {
    this._navbarService.handleLogin();
  }

  handleNavItemClick(item: NavElement, event: Event): void {
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
}
