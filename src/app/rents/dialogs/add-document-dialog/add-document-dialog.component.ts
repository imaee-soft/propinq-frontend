import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentLoaderComponent } from '../../../shared/components/document-loader/document-loader.component';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { RentDocumentRequest } from '../../interfaces/create-document.interface';
import { RentService } from '../../rents.service';

interface NewDocumentInfo {
  rentId: string;
}

const DOCUMENT_CREATED = 'El documento fue agregado con éxito!';

@Component({
  selector: 'app-add-document-dialog',
  imports: [
    ReactiveFormsModule,
    GenericDialogComponent,
    MatFormFieldModule,
    DocumentLoaderComponent,
    MatInputModule,
  ],
  templateUrl: './add-document-dialog.component.html',
  styleUrl: './add-document-dialog.component.css',
})
export class AddDocumentDialogComponent {
  private _data: NewDocumentInfo = inject(MAT_DIALOG_DATA);
  private _formBuilder = inject(FormBuilder);
  private _rentService = inject(RentService);
  private _notificationService = inject(NotificationService);
  private _matDialogRef = inject(MatDialogRef);

  form: FormGroup;
  isLoading = signal(false);

  constructor() {
    this.form = this._formBuilder.group({
      name: this._formBuilder.control<string>('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      document: this._formBuilder.control<File | null>(null, [
        Validators.required,
      ]),
    });
  }

  handleDocumentUploaded(file: File) {
    this.uploadDocumentAndMarkTouchedControl(file);
  }

  handleDocumentRemoved() {
    this.uploadDocumentAndMarkTouchedControl(null);
  }

  handleSubmit() {
    this.isLoading.set(true);
    const formValue = this.form.value;
    const request = this.buildRequest(formValue);
    const contract = formValue.document as File;
    this._rentService.saveDocument(request, contract).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._notificationService.success(DOCUMENT_CREATED, 3000);
        this._matDialogRef.close(true);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  private uploadDocumentAndMarkTouchedControl(document: File | null) {
    this.form.patchValue({ document: document });
    this.form.get('document')?.markAsTouched();
  }

  private buildRequest(value: any): RentDocumentRequest {
    return {
      rentId: this._data.rentId,
      name: value.name as string,
    };
  }

  get nameControl() {
    return this.form.get('name');
  }

  get documentControl() {
    return this.form.get('document');
  }
}
