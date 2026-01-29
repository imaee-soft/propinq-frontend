import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/services/auth.service';
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
        this.getUserNotifications(user.userId).subscribe();
      } else {
        this.loggedUserNotifications.set([]);
      }
    });
  }

  getUserNotifications(userId: string) {
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
      .patch<NotificationResponse>(`${this._baseUrl}/${notificationId}`, {})
      .pipe(
        tap(() => {
          this.loggedUserNotifications.update((notifications) =>
            notifications.filter((n) => n.notificationId !== notificationId),
          );
        }),
      );
  }

  deleteNotification(notificationId: string) {
    this.loggedUserNotifications.update((notifications) =>
      notifications.filter((n) => n.notificationId !== notificationId),
    );
  }
}
