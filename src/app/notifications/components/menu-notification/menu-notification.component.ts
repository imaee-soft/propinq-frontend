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
  CONTACT_CANCELLED: 'person_off',
  CONTACT_RENTED: 'person',
  PROFILE_CHANGE_REQUEST: 'switch_account',
  PROFILE_CHANGE_ACCEPTED: 'check_circle',
  PROFILE_CHANGE_REJECTED: 'cancel',
  RENT_CANCELLED: 'cancel',
};

const TYPE_TEXTS: Record<string, string> = {
  NEW_CONTACT_REQUEST: 'envió una nueva solicitud de negociación.',
  CONTACT_ACCEPTED: 'aceptó la solicitud de negociación.',
  CONTACT_REJECTED: 'rechazó la solicitud de negociación.',
  CONTACT_CANCELLED: 'dió de baja la solicitud de negociación.',
  CONTACT_RENTED: 'dió de alta un alquiler a tu nombre.',
  PROFILE_CHANGE_REQUEST: 'solicitó un cambio de perfil.',
  PROFILE_CHANGE_ACCEPTED: 'aceptó tu solicitud de cambio de perfil.',
  PROFILE_CHANGE_REJECTED: 'rechazó tu solicitud de cambio de perfil.',
  RENT_CANCELLED: 'canceló un alquiler a tu nombre.',
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
    this.markAsSeen(notification);
    this._router.navigateByUrl(notification.url ?? '/');
  }

  markAsSeen(notification: NotificationResponse) {
    this._notificationsService
      .markAsSeen(notification.notificationId)
      .subscribe();
  }

  deleteNotification() {
    const notification = this.notification();
    this._notificationsService.deleteNotification(notification.notificationId);
  }
}
