import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentLoaderComponent } from '../../../shared/components/document-loader/document-loader.component';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { RentService } from '../../rents.service';

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
  private _formBuilder = inject(FormBuilder);
  private _rentService = inject(RentService);

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

  handleSubmit() {}

  private uploadDocumentAndMarkTouchedControl(document: File | null) {
    this.form.patchValue({ document: document });
    this.form.get('document')?.markAsTouched();
  }

  get nameControl() {
    return this.form.get('name');
  }

  get documentControl() {
    return this.form.get('document');
  }
}
