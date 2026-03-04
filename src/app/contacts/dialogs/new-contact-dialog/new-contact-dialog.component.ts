import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PropertyDetails } from '../../../properties/interfaces/property-details.interface';
import { NotificationService } from '../../../shared/services/notification.service';
import { ContactsService } from '../../contacts.service';

const CONTACT_CREATED = 'La solicitud de negociación fue enviada con éxito!';

@Component({
  selector: 'new-contact-dialog',
  templateUrl: 'new-contact-dialog.component.html',
  styleUrls: ['new-contact-dialog.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatLabel,
  ],
})
export class NewContactDialogComponent {
  private _contactsService = inject(ContactsService);
  private _notificationService = inject(NotificationService);
  private _data: PropertyDetails = inject(MAT_DIALOG_DATA);
  private _matDialogRef = inject(MatDialogRef);

  message = new FormControl<string>(
    `Hola ${this._data.ownerFullName}! Estoy interesado en tu propiedad. \nMe gustaría que charláramos por algún medio para poder concretar un alquiler. ¡Muchas gracias!`,
  );

  title = computed(() => this._data.title);
  owner = computed(() => this._data.ownerFullName);
  isLoading = signal(false);

  saveContactRequest() {
    this.isLoading.set(true);
    this._contactsService
      .saveContactRequest({
        propertyId: this._data.propertyId,
        message: this.message.value!,
      })
      .subscribe({
        next: () => {
          this._notificationService.success(CONTACT_CREATED, 3000);
          this._matDialogRef.close();
        },
        error: () => this.isLoading.set(false),
      });
  }
}
