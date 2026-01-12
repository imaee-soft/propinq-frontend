import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ContactsService } from '../../../contacts/contacts.service';
import { ContactResponse } from '../../../contacts/interfaces/contact-response.interface';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationResponse } from '../../interfaces/notification-response.interface';

const CONTACT_ACCEPTED = 'La solicitud de contacto fue aceptada con éxito!';
const CONTACT_REJECTED = 'La solicitud de contacto fue cancelada con éxito!';

@Component({
  selector: 'contact-actions-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressSpinner,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatLabel,
  ],
  templateUrl: './contact-actions-dialog.component.html',
  styleUrl: './contact-actions-dialog.component.css',
})
export class ContactActionsDialogComponent implements OnInit {
  private _contactsService = inject(ContactsService);
  private _data: NotificationResponse = inject(MAT_DIALOG_DATA);
  private _matDialogRef = inject(MatDialogRef);
  private _notificationService = inject(NotificationService);

  contact = signal<ContactResponse | null>(null);
  issuerFullName = computed(() => this.contact()?.issuerFullName ?? '');
  message = computed(() => this.contact()?.message ?? '');

  response = new FormControl<string>('');
  action: 'ACCEPT' | 'REJECT' = 'ACCEPT';
  isLoading = signal(false);

  constructor() {
    this.setDefaultResponse();
  }

  ngOnInit(): void {
    this._contactsService.getContact(this._data.contactId).subscribe({
      next: (contact) => this.contact.set(contact),
    });
  }

  changeAction(action: 'ACCEPT' | 'REJECT') {
    this.action = action;
    this.setDefaultResponse();
  }

  setDefaultResponse() {
    if (this.action === 'ACCEPT') {
      this.response.setValue(
        `Hola ${this._data.notifierFullName}! Acepto tu solicitud. \nEstoy dispuesto a que dialoguemos vía WhatsApp para discutir el alquiler de la propiedad. ¡Saludos!`
      );
    } else {
      this.response.setValue(
        `Hola ${this._data.notifierFullName}. Lamento informarte que no puedo aceptar tu solicitud de contacto en este momento. \nTe deseo lo mejor en tu búsqueda de propiedades. ¡Saludos!`
      );
    }
  }

  submitAnswer() {
    this.isLoading.set(true);
    this._contactsService
      .answerContact(this._data.contactId, {
        answer: this.response.value ?? '',
        newState: this.action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this._matDialogRef.close(true);
          this._notificationService.success(
            this.action === 'ACCEPT' ? CONTACT_ACCEPTED : CONTACT_REJECTED
          );
        },
        error: () => this.isLoading.set(false),
      });
  }
}
