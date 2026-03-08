import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { NotificationResponse } from '../../notifications/interfaces/notification-response.interface';
import { NotificationsService } from '../../notifications/notifications.service';
import { LargePage } from '../../shared/interfaces/page.interface';

@Component({
  selector: 'app-notifications-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltip,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './notifications-page.component.html',
  styleUrls: [
    './notifications-page.component.css',
    '../../shared/pages/common-entity-page/common-entity-page.component.css',
  ],
})
export class NotificationsPageComponent implements OnInit {
  private _authService = inject(AuthService);
  private _notificationsService = inject(NotificationsService);

  loggedUser = computed(() => this._authService.user());
  pageNumber = signal(0);
  notifications = signal<LargePage<NotificationResponse> | undefined>(
    undefined,
  );
  notificationList = computed(() => this.notifications()?.content || []);
  notificationCount = computed(() => this.notifications()?.totalElements || 0);

  displayedColumns = ['date', 'notifier', 'title', 'actions'];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const userId = this.loggedUser()?.userId || '';
    this._notificationsService
      .getUserNotifications(userId, this.pageNumber())
      .pipe(
        tap((notifications) => {
          this.notifications.set(notifications);
        }),
      )
      .subscribe();
  }

  openLink(notification: NotificationResponse) {
    window.open(notification.url, '_blank');
  }

  markAsSeen(notification: NotificationResponse) {
    this._notificationsService
      .markAsSeen(notification.notificationId)
      .pipe(
        tap(() => {
          this.notifications.update((currentPage) => {
            if (!currentPage) return currentPage;
            return {
              ...currentPage,
              content: currentPage.content.map((n) => {
                if (n.notificationId === notification.notificationId) {
                  return { ...n, seen: true };
                }
                return n;
              }),
            };
          });
        }),
      )
      .subscribe();
  }

  markAsUnseen(notification: NotificationResponse) {
    this._notificationsService
      .markAsUnseen(notification.notificationId)
      .pipe(
        tap(() => {
          this.notifications.update((currentPage) => {
            if (!currentPage) return currentPage;
            return {
              ...currentPage,
              content: currentPage.content.map((n) => {
                if (n.notificationId === notification.notificationId) {
                  return { ...n, seen: false };
                }
                return n;
              }),
            };
          });
        }),
      )
      .subscribe();
  }

  page(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.loadNotifications();
  }

  goBack(): void {
    window.history.back();
  }

  isSeen(notification: NotificationResponse): boolean {
    return notification.seen;
  }
}
