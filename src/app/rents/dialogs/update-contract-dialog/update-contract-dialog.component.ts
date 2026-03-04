import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentLoaderComponent } from '../../../shared/components/document-loader/document-loader.component';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { RentService } from '../../rents.service';

interface UpdateContractInfo {
  currentContractName: string;
  rentId: string;
}

@Component({
  selector: 'app-update-contract-dialog',
  imports: [
    ReactiveFormsModule,
    GenericDialogComponent,
    MatFormFieldModule,
    DocumentLoaderComponent,
  ],
  templateUrl: './update-contract-dialog.component.html',
  styleUrl: './update-contract-dialog.component.css',
})
export class UpdateContractDialogComponent {
  private _data: UpdateContractInfo = inject(MAT_DIALOG_DATA);
  private _formBuilder = inject(FormBuilder);
  private _rentService = inject(RentService);
  private _matDialogRef = inject(MatDialogRef);

  form: FormGroup;
  isLoading = signal(false);

  constructor() {
    this.form = this._formBuilder.group({
      document: this._formBuilder.control<File | null>(null, [
        Validators.required,
      ]),
    });
  }

  handleDocumentUploaded(file: File) {
    this.form.patchValue({ document: file });
    this.form.get('document')?.markAsTouched();
  }

  handleDocumentRemoved() {
    this.form.patchValue({ document: null });
    this.form.get('document')?.markAsTouched();
  }

  handleSubmit() {
    this.isLoading.set(true);
    const formValue = this.form.value;
    this._rentService
      .updateContract(this._data.rentId, formValue.document)
      .subscribe({
        next: () => {
          this._matDialogRef.close(formValue.document);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  get documentControl() {
    return this.form.get('document');
  }

  get data(): UpdateContractInfo {
    return this._data;
  }
}
