import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { NotificationResponse } from './interfaces/notification-response.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/notifications`;

  getUserNotifications(userId: string) {
    return this._http.get<NotificationResponse[]>(
      `${this._baseUrl}/user/${userId}`
    );
  }
}
