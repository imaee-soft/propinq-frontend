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
  selector: 'app-property-type-form-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.isEditing ? 'Editar Tipo de vivienda' : 'Nuevo Tipo de vivienda' }}</h2>
      
      <mat-dialog-content>
        <form [formGroup]="propertyTypeForm" class="form-container">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nombre *</mat-label>
              <input matInput formControlName="name" placeholder="Ej: Apartamento, Casa, Duplex">
              @if (propertyTypeForm.get('name')?.invalid && propertyTypeForm.get('name')?.touched) {
                <mat-error>El nombre es requerido</mat-error>
              }
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Descripción *</mat-label>
              <textarea matInput 
                        formControlName="description" 
                        rows="1" 
                        placeholder="Descripción del tipo de vivienda">
              </textarea>
              @if (propertyTypeForm.get('description')?.invalid && propertyTypeForm.get('description')?.touched) {
                <mat-error>La descripción es requerida</mat-error>
              }
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" class="cancel-btn">Cancelar</button>
        <button mat-raised-button 
                color="primary" 
                (click)="onSave()" 
                [disabled]="propertyTypeForm.invalid"
                class="save-btn">
          {{ data.isEditing ? 'Guardar' : 'Guardar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrl: './property-type-form-dialog.component.css'
})
export class PropertyTypeFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PropertyTypeFormDialogComponent>);
  
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
