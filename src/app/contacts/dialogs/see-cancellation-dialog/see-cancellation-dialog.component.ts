import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface CancellationInfo {
  title?: string;
  cancellationDate: Date;
  cancellationReason: string;
}

@Component({
  selector: 'contact-actions-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    DatePipe,
  ],
  templateUrl: './see-cancellation-dialog.component.html',
  styleUrl: './see-cancellation-dialog.component.css',
})
export class SeeCancellationDialogComponent {
  private _data: CancellationInfo = inject(MAT_DIALOG_DATA);
  title = computed(
    () => this._data.title || 'Cancelación de solicitud de contacto',
  );
  cancellationDate = computed(() => this._data.cancellationDate);
  cancellationReason = computed(() => this._data.cancellationReason);
}
