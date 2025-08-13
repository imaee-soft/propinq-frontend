import { Component, inject, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { PropertyTypeService } from '../services/property-type.service';
import { PropertyTypeResponse, PropertyTypeRequest } from '../interfaces/property-type.interface';
import { PropertyTypeFormDialogComponent } from './property-type-form-dialog.component';

@Component({
  selector: 'app-property-type-crud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule, MatPaginatorModule],
  template: `
    <div class="building-page">
      <h2>Tipos de Viviendas</h2>
      
      <!-- Contenedor centrado para la tabla -->
      <div class="table-wrapper">
        <div class="table-container">
          <!-- Botón flotante posicionado sobre la tabla -->
          <button mat-fab
                  color="primary"
                  class="fab-add-table"
                  (click)="onCreate()"
                  title="Agregar nuevo tipo de vivienda">
            <mat-icon>add</mat-icon>
          </button>
          
          @if (isLoading) {
            <div class="loading">Cargando...</div>
          } @else if (errorMessage) {
            <div class="error">{{ errorMessage }}</div>
          } @else if (dataSource.data.length === 0) {
            <div class="empty">No hay tipos de viviendas registrados</div>
          }
          
          @if (dataSource.data.length > 0) {
            <table mat-table [dataSource]="dataSource" class="property-table">

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
                <th mat-header-cell *matHeaderCellDef class="actions-header">Acciones</th>
                <td mat-cell *matCellDef="let propertyType" class="actions-cell">
                  <div class="actions-container">
                    <button mat-icon-button
                            color="primary"
                            (click)="onUpdate(propertyType)"
                            [disabled]="isLoading || propertyType.deleted"
                            title="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    @if (!propertyType.deleted) {
                      <button mat-icon-button
                              color="warn"
                              (click)="onDelete(propertyType)"
                              [disabled]="isLoading"
                              title="Eliminar">
                        <mat-icon>delete</mat-icon>
                      </button>
                    } @else {
                      <button mat-icon-button
                              color="accent"
                              (click)="onRestore(propertyType.id)"
                              [disabled]="isLoading"
                              title="Restaurar">
                        <mat-icon>restore</mat-icon>
                      </button>
                    }
                  </div>
                </td>
              </ng-container>

              <!-- Definición de las filas -->
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns" [class.inactive-row]="row.deleted"></tr>

            </table>
          }
          
          <!-- Paginador siempre visible cuando hay datos -->
          @if (dataSource.data.length > 0) {
            <mat-paginator #paginator
                          [pageSize]="6"
                          [pageSizeOptions]="[6, 12, 24]"
                          [showFirstLastButtons]="true"
                          [hidePageSize]="false"
                          aria-label="Seleccionar página de tipos de vivienda"
                          class="property-paginator">
            </mat-paginator>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './property-type-crud.component.css'
})
export class PropertyTypeCrudComponent implements OnInit, AfterViewInit {
  private _propertyTypeService = inject(PropertyTypeService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Variables de estado
  dataSource = new MatTableDataSource<PropertyTypeResponse>([]);
  isLoading = false;
  errorMessage = '';

  // Columnas para mat-table
  displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor() {
    // Configurar pageSize por defecto
    this.dataSource.paginator = null;
  }

  ngOnInit(): void {
    this.loadPropertyTypes();
  }

  ngAfterViewInit(): void {
    // El paginador se configurará cuando se carguen los datos
  }

  loadPropertyTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this._propertyTypeService.getPropertyTypes().subscribe({
      next: (data) => {
        console.log('Datos cargados:', data.length, 'elementos');
        this.dataSource.data = data;
        this.isLoading = false;
        
        // Configurar paginador después de que Angular renderice la vista
        setTimeout(() => {
          if (this.paginator) {
            console.log('Configurando paginator:', this.paginator);
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 6;
            this.paginator.pageIndex = 0;
            console.log('Paginator configurado - pageSize:', this.paginator.pageSize);
            this.cdr.detectChanges();
          } else {
            console.log('Paginator aún no disponible');
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error al cargar tipos de propiedad:', error);
        this.errorMessage = 'Error al cargar los tipos de viviendas';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.openCreateDialog();
  }

  onUpdate(propertyType: PropertyTypeResponse): void {
    this.openEditDialog(propertyType);
  }

  onDelete(propertyType: PropertyTypeResponse): void {
    this.deletePropertyType(propertyType.id);
  }

  onRestore(id: string): void {
    this.restorePropertyType(id);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PropertyTypeFormDialogComponent, {
      width: '560px',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
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
      width: '560px',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      data: { propertyType, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.updatePropertyType(propertyType.id, result.data);
      }
    });
  }

  private createPropertyType(formValue: PropertyTypeRequest): void {
    this._propertyTypeService.createPropertyType(formValue).subscribe({
      next: () => {
        this.loadPropertyTypes();
      },
      error: (error) => {
        console.error('Error al crear tipo de propiedad:', error);
        alert('Error al crear el tipo de propiedad. Verifica que el backend esté corriendo.');
      }
    });
  }

  private updatePropertyType(id: string, formValue: PropertyTypeRequest): void {
    this._propertyTypeService.updatePropertyType(id, formValue).subscribe({
      next: () => {
        this.loadPropertyTypes();
      },
      error: (error) => {
        console.error('Error al actualizar tipo de propiedad:', error);
        alert('Error al actualizar el tipo de propiedad. Verifica que el backend esté corriendo.');
      }
    });
  }

  deletePropertyType(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de propiedad?')) {
      this._propertyTypeService.deletePropertyType(id).subscribe({
        next: () => {
          this.loadPropertyTypes();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar el tipo de propiedad.');
        }
      });
    }
  }

  restorePropertyType(id: string): void {
    if (confirm('¿Estás seguro de que deseas restaurar este tipo de propiedad?')) {
      this._propertyTypeService.restorePropertyType(id).subscribe({
        next: () => {
          this.loadPropertyTypes();
        },
        error: (error) => {
          console.error('Error al restaurar:', error);
          alert('Error al restaurar el tipo de propiedad.');
        }
      });
    }
  }
}
