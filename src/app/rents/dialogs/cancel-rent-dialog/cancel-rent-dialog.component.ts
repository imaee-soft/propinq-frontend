import { Component, inject, signal } from '@angular/core';
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
import { RentService } from '../../rents.service';

interface RentWrapper {
  rentId: string;
  issuerFullName: string;
  rentDate: Date;
}

const RENT_CANCELLED = 'El contrato de alquiler fue dado de baja con éxito!';

@Component({
  selector: 'app-cancel-rent-dialog',
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
  templateUrl: './cancel-rent-dialog.component.html',
  styleUrls: [
    './cancel-rent-dialog.component.css',
    '../../../contacts/dialogs/reject-contact-dialog/reject-contact-dialog.component.css',
  ],
})
export class CancelRentDialogComponent {
  private _rentService = inject(RentService);
  private _data: RentWrapper = inject(MAT_DIALOG_DATA);
  private _matDialogRef = inject(MatDialogRef);
  private _notificationService = inject(NotificationService);

  rentId = this._data.rentId;
  issuerFullName = this._data.issuerFullName;
  rentDate = this._data.rentDate;

  response = new FormControl<string>('');
  isLoading = signal(false);

  cancel() {
    this.isLoading.set(true);
    this._rentService
      .cancelRent(this.rentId, {
        reason: this.response.value ?? '',
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this._matDialogRef.close(true);
          this._notificationService.success(RENT_CANCELLED);
        },
        error: () => this.isLoading.set(false),
      });
  }
}
