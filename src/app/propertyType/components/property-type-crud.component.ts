import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { PropertyTypeService } from '../services/property-type.service';
import { PropertyTypeResponse, PropertyTypeRequest } from '../interfaces/property-type.interface';
import { PropertyTypeFormDialogComponent } from './property-type-form-dialog.component';

@Component({
  selector: 'app-property-type-crud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule, MatPaginatorModule],
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
          <table mat-table [dataSource]="getPaginatedData()" class="mat-elevation-8">
            
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
                @if (propertyType.id) {
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
                }
              </td>
            </ng-container>
            
            <!-- Definición de las filas -->
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class.inactive-row]="row.deleted"
                [class.empty-row]="!row.id"></tr>
            
          </table>
          
          <!-- Paginador -->
          <mat-paginator 
            [length]="getPropertyTypes().length"
            [pageSize]="pageSize()"
            [pageSizeOptions]="pageSizeOptions"
            [pageIndex]="pageIndex()"
            (page)="onPageChange($event)"
            showFirstLastButtons
            class="mat-elevation-8">
          </mat-paginator>
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
  private _intl = inject(MatPaginatorIntl);

  isLoading = signal(false);
  
  // Paginación
  pageIndex = signal(0);
  pageSize = signal(5);
  pageSizeOptions = [5, 10, 20];

  // Columnas para mat-table
  displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor() {
    // Personalizar las etiquetas del paginador
    this._intl.itemsPerPageLabel = 'Elementos por página:';
    this._intl.nextPageLabel = 'Página siguiente';
    this._intl.previousPageLabel = 'Página anterior';
    this._intl.firstPageLabel = 'Primera página';
    this._intl.lastPageLabel = 'Última página';
    this._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  propertyTypesResource = rxResource({
    loader: () => this._propertyTypeService.getPropertyTypes()
  });

  getPropertyTypes() {
    return this.propertyTypesResource.value() || [];
  }

  getPaginatedData() {
    const data = this.getPropertyTypes();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    const paginatedData = data.slice(startIndex, endIndex);
    
    // Rellenar con filas vacías hasta completar el pageSize
    while (paginatedData.length < this.pageSize()) {
      paginatedData.push({
        id: '',
        name: '',
        description: '',
        deleted: false,
        createdAt: undefined,
        updatedAt: undefined
      });
    }
    
    return paginatedData;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
