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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../shared/services/notification.service';
import { formatDate } from '../../../shared/utilities/date.pipes';
import { ContactsService } from '../../contacts.service';

interface ContactWrapper {
  contactId: string;
  issuerFullName: string;
  contactDate: Date;
}

const CONTACT_CANCELLED = 'La solicitud de contacto fue rechazada con éxito!';

@Component({
  selector: 'app-reject-contact-dialog',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reject-contact-dialog.component.html',
  styleUrls: ['./reject-contact-dialog.component.css'],
})
export class RejectContactDialogComponent {
  private _contactsService = inject(ContactsService);
  private _data: ContactWrapper = inject(MAT_DIALOG_DATA);
  private _matDialogRef = inject(MatDialogRef);
  private _notificationService = inject(NotificationService);

  contactId = computed(() => this._data.contactId);
  issuerFullName = computed(() => this._data.issuerFullName);
  contactDate = computed(() => this.formatDateWrapper(this._data.contactDate));

  response = new FormControl<string>('');
  isLoading = signal(false);

  formatDateWrapper(date: Date): string {
    return formatDate(date);
  }

  cancel() {
    this.isLoading.set(true);
    this._contactsService
      .rejectContact(this._data.contactId, {
        answer: this.response.value ?? '',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this._matDialogRef.close(true);
          this._notificationService.success(CONTACT_CANCELLED);
        },
        error: () => this.isLoading.set(false),
      });
  }
}
