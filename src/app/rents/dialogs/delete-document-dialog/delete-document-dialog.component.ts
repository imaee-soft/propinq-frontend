import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { RentService } from '../../rents.service';

interface DeleteDocumentInfo {
  documentId: string;
  documentName: string;
}

const DOCUMENT_DELETED = 'El documento fue eliminado con éxito!';

@Component({
  selector: 'app-delete-document-dialog',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    GenericDialogComponent,
  ],
  templateUrl: './delete-document-dialog.component.html',
  styleUrl: './delete-document-dialog.component.css',
})
export class DeleteDocumentDialogComponent {
  private _rentService = inject(RentService);
  private _notificationService = inject(NotificationService);
  private _matDialogRef = inject(MatDialogRef);
  private _data: DeleteDocumentInfo = inject(MAT_DIALOG_DATA);

  isLoading = signal(false);

  get documentName() {
    return this._data.documentName;
  }

  delete() {
    this.isLoading.set(true);
    this._rentService.deleteDocument(this._data.documentId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._notificationService.success(DOCUMENT_DELETED);
        this._matDialogRef.close(true);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
