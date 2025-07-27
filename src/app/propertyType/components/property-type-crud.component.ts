import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { PropertyTypeService } from '../services/property-type.service';
import { PropertyTypeResponse, PropertyTypeRequest } from '../interfaces/property-type.interface';
import { PropertyTypeFormDialogComponent } from './property-type-form-dialog.component';

@Component({
  selector: 'app-property-type-crud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule],
  template: `
    <div class="property-type-crud">
      <h2>Tipos de Viviendas</h2>
      
      <!-- Solo la tabla -->
      <div class="table-container">
        @if (propertyTypesResource.isLoading()) {
          <div class="loading">Cargando...</div>
        }
        
        @if (propertyTypesResource.error()) {
          <div class="error">Error al cargar los tipos de viviendas</div>
        }
        
        @if (getPropertyTypes().length === 0 && !propertyTypesResource.isLoading()) {
          <div class="empty">No hay tipos de viviendas registrados</div>
        }
        
        @if (getPropertyTypes().length > 0) {
          <!-- Material Table -->
          <table mat-table [dataSource]="getPropertyTypes()" class="mat-elevation-8">
            
            <!-- Columna Nombre -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let propertyType">{{ propertyType.name }}</td>
            </ng-container>
            
            <!-- Columna Descripción -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let propertyType">{{ propertyType.description || '-' }}</td>
            </ng-container>
            
            <!-- Columna Acciones -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let propertyType">
                <button mat-icon-button 
                        color="primary"
                        (click)="editPropertyType(propertyType)" 
                        [disabled]="isLoading() || propertyType.deleted"
                        title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                @if (!propertyType.deleted) {
                  <button mat-icon-button 
                          color="warn"
                          (click)="deletePropertyType(propertyType.id)"
                          [disabled]="isLoading()"
                          title="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                } @else {
                  <button mat-icon-button 
                          color="accent"
                          (click)="restorePropertyType(propertyType.id)"
                          [disabled]="isLoading()"
                          title="Restaurar">
                    <mat-icon>restore</mat-icon>
                  </button>
                }
              </td>
            </ng-container>
            
            <!-- Definición de las filas -->
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class.inactive-row]="row.deleted"></tr>
            
          </table>
        }
      </div>
      
      <!-- Botón flotante para agregar -->
      <button mat-fab 
              color="primary" 
              class="fab-add" 
              (click)="openCreateDialog()"
              title="Agregar nuevo tipo de vivienda">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styleUrl: './property-type-crud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyTypeCrudComponent {
  private _propertyTypeService = inject(PropertyTypeService);
  private dialog = inject(MatDialog);

  isLoading = signal(false);

  // Columnas para mat-table
  displayedColumns: string[] = ['name', 'description', 'actions'];

  propertyTypesResource = rxResource({
    loader: () => this._propertyTypeService.getPropertyTypes()
  });

  getPropertyTypes() {
    return this.propertyTypesResource.value() || [];
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PropertyTypeFormDialogComponent, {
      width: '500px',
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.createPropertyType(result.data);
      }
    });
  }

  openEditDialog(propertyType: PropertyTypeResponse): void {
    const dialogRef = this.dialog.open(PropertyTypeFormDialogComponent, {
      width: '500px',
      data: { propertyType, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.updatePropertyType(propertyType.id, result.data);
      }
    });
  }

  private createPropertyType(formValue: PropertyTypeRequest): void {
    this.isLoading.set(true);
    
    this._propertyTypeService.createPropertyType(formValue).subscribe({
      next: () => {
        this.propertyTypesResource.reload();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error al crear tipo de propiedad:', error);
        alert('Error al crear el tipo de propiedad. Verifica que el backend esté corriendo.');
      }
    });
  }

  private updatePropertyType(id: string, formValue: PropertyTypeRequest): void {
    this.isLoading.set(true);
    
    this._propertyTypeService.updatePropertyType(id, formValue).subscribe({
      next: () => {
        this.propertyTypesResource.reload();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error al actualizar tipo de propiedad:', error);
        alert('Error al actualizar el tipo de propiedad. Verifica que el backend esté corriendo.');
      }
    });
  }

  editPropertyType(propertyType: PropertyTypeResponse): void {
    this.openEditDialog(propertyType);
  }

  deletePropertyType(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de propiedad?')) {
      this.isLoading.set(true);
      
      this._propertyTypeService.deletePropertyType(id).subscribe({
        next: () => {
          this.propertyTypesResource.reload();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error al eliminar:', error);
          alert('Error al eliminar el tipo de propiedad.');
        }
      });
    }
  }

  restorePropertyType(id: string): void {
    if (confirm('¿Estás seguro de que deseas restaurar este tipo de propiedad?')) {
      this.isLoading.set(true);
      
      this._propertyTypeService.restorePropertyType(id).subscribe({
        next: () => {
          this.propertyTypesResource.reload();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error al restaurar:', error);
          alert('Error al restaurar el tipo de propiedad.');
        }
      });
    }
  }
}
