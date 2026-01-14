import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { NewBuildingDialogComponent } from '../../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { MenuNotificationComponent } from '../../../notifications/components/menu-notification/menu-notification.component';
import { NotificationResponse } from '../../../notifications/interfaces/notification-response.interface';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NewHouseDialogComponent } from '../../../properties/dialogs/new-house-dialog/new-house-dialog.component';
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
    MatBadgeModule,
    MenuNotificationComponent,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private _navbarService = inject(NavbarService);
  private _sidebarService = inject(SidebarService);
  private _entityDialogService = inject(EntityDialogService);
  private _router = inject(Router);
  private _notificationsService = inject(NotificationsService);

  items = computed(() => this._navbarService.config());
  sidebarOpened = this._sidebarService.isOpen;
  filtersOpened = computed(() => this._navbarService.filtersOpen());
  navbarDisabled = computed(() => this._navbarService.disabled());
  propertyDetailsOpened = signal(false);
  buildingDetailsOpened = signal(false);
  notifications = signal<NotificationResponse[]>([]);
  notificationNumber = computed(
    () => this.notifications().filter((n) => !n.seen).length
  );

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

  isOwner = computed(() => this._navbarService.isOwner());

  ngOnInit() {
    if (this.userLogged) {
      this._notificationsService.getUserNotifications(this.userId!).subscribe({
        next: (notifications) => this.notifications.set(notifications),
      });
    }
  }

  toggleSidebar() {
    this._sidebarService.toggle();
  }

  handlePublish() {
    if (!this.userLogged) {
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

  publishHouse() {
    this._entityDialogService
      .openNewEntityDialog(NewHouseDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'house',
      })
      .subscribe();
  }

  handleMyAccount() {
    this._router.navigate(['/users/my-account']);
  }

  handleLogout() {
    this._navbarService.handleLogout();
  }

  get userLogged() {
    return this._navbarService.userLogged();
  }

  get username() {
    return this._navbarService.username();
  }

  get userId() {
    return this._navbarService.userId();
  }
}
