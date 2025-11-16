import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContactActionsDialogComponent } from '../../dialogs/contact-actions-dialog/contact-actions-dialog.component';
import { NotificationResponse } from '../../interfaces/notification-response.interface';

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
  imports: [MatMenuModule, MatIconModule],
  templateUrl: './menu-notification.component.html',
  styleUrl: './menu-notification.component.css',
})
export class MenuNotificationComponent {
  private _matDialog = inject(MatDialog);
  notification = input.required<NotificationResponse>();

  icon = computed(() => TYPE_ICONS[this.notification().type]);
  text = computed(
    () =>
      `${this.notification().notifierFullName} ${
        TYPE_TEXTS[this.notification().type]
      }`
  );

  openNotification() {
    if (this.notification().type === 'NEW_CONTACT_REQUEST') {
      this.openContactResponseDialog(this.notification());
    }
  }

  openContactResponseDialog(notification: NotificationResponse) {
    this._matDialog.open(ContactActionsDialogComponent, {
      panelClass: 'contact-dialog',
      data: notification,
    });
  }
}
