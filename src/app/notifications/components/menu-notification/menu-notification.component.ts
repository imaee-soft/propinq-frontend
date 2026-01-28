import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NotificationResponse } from '../../interfaces/notification-response.interface';
import { NotificationsService } from '../../notifications.service';

const TYPE_ICONS: Record<string, string> = {
  NEW_CONTACT_REQUEST: 'person_add',
  CONTACT_ACCEPTED: 'person',
  CONTACT_REJECTED: 'person_off',
};

const TYPE_TEXTS: Record<string, string> = {
  NEW_CONTACT_REQUEST: 'envió una nueva solicitud de contacto.',
  CONTACT_ACCEPTED: 'aceptó la solicitud de contacto.',
  CONTACT_REJECTED: 'rechazó la solicitud de contacto.',
};

@Component({
  selector: 'menu-notification',
  imports: [MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './menu-notification.component.html',
  styleUrl: './menu-notification.component.css',
})
export class MenuNotificationComponent {
  private _router = inject(Router);
  private _notificationsService = inject(NotificationsService);

  notification = input.required<NotificationResponse>();

  icon = computed(() => TYPE_ICONS[this.notification().type]);
  text = computed(
    () =>
      `${this.notification().notifierFullName} ${
        TYPE_TEXTS[this.notification().type]
      }`,
  );

  openNotification() {
    const notification = this.notification();
    this._router.navigateByUrl(notification.url ?? '/');
  }

  deleteNotification() {
    const notification = this.notification();
    this._notificationsService.deleteNotification(notification.notificationId);
  }
}
