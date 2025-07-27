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
      <h2 mat-dialog-title>{{ data.isEditing ? 'Editar' : 'Nuevo' }} Tipo de Vivienda</h2>
      
      <mat-dialog-content>
        <form [formGroup]="propertyTypeForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre *</mat-label>
            <input matInput formControlName="name" placeholder="Ej: Apartamento, Casa, Duplex">
            @if (propertyTypeForm.get('name')?.invalid && propertyTypeForm.get('name')?.touched) {
              <mat-error>El nombre es requerido</mat-error>
            }
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Descripción del tipo de vivienda"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button 
                color="primary" 
                (click)="onSave()" 
                [disabled]="propertyTypeForm.invalid">
          {{ data.isEditing ? 'Actualizar' : 'Crear' }}
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
    description: [this.data.propertyType?.description || '']
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
