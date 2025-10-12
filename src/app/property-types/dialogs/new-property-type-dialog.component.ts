import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PropertyTypeResponse } from '../interfaces/property-type.interface';

export interface PropertyTypeDialogData {
  propertyType?: PropertyTypeResponse;
  isEditing: boolean;
}

@Component({
  selector: 'app-new-property-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './new-property-type-dialog.component.html',
  styleUrl: './new-property-type-dialog.component.css'
})
export class NewPropertyTypeDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewPropertyTypeDialogComponent>);

  data = inject<PropertyTypeDialogData>(MAT_DIALOG_DATA);

  propertyTypeForm: FormGroup = this.fb.group({
    name: [this.data.propertyType?.name || '', [Validators.required, Validators.minLength(2)]],
    description: [this.data.propertyType?.description || '', [Validators.required, Validators.minLength(5)]]
  });

  onSave(): void {
    if (this.propertyTypeForm.valid) {
      this.dialogRef.close({
        action: 'save',
        data: this.propertyTypeForm.value
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
