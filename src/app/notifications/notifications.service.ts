import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { LargePage } from '../shared/interfaces/page.interface';
import { NotificationResponse } from './interfaces/notification-response.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/notifications`;
  private _authService = inject(AuthService);

  loggedUserNotifications = signal<NotificationResponse[]>([]);

  constructor() {
    effect(() => {
      const user = this._authService.user();
      if (user) {
        this.getUserUnseenNotifications(user.userId).subscribe();
      } else {
        this.loggedUserNotifications.set([]);
      }
    });
  }

  getUserNotifications(userId: string, page: number, size: number = 6) {
    return this._http.get<LargePage<NotificationResponse>>(
      `${this._baseUrl}/user-all/${userId}`,
      {
        params: { page, size },
      },
    );
  }

  getUserUnseenNotifications(userId: string) {
    return this._http
      .get<NotificationResponse[]>(`${this._baseUrl}/user/${userId}`)
      .pipe(
        tap((notifications) => {
          this.loggedUserNotifications.set(notifications);
        }),
      );
  }

  markAsSeen(notificationId: string) {
    return this._http
      .patch<NotificationResponse>(`${this._baseUrl}/see/${notificationId}`, {})
      .pipe(
        tap(() => {
          this.loggedUserNotifications.update((notifications) =>
            notifications.filter((n) => n.notificationId !== notificationId),
          );
        }),
      );
  }

  markAsUnseen(notificationId: string) {
    return this._http.patch<NotificationResponse>(
      `${this._baseUrl}/unsee/${notificationId}`,
      {},
    );
  }

  deleteNotification(notificationId: string) {
    this.loggedUserNotifications.update((notifications) =>
      notifications.filter((n) => n.notificationId !== notificationId),
    );
  }
}
