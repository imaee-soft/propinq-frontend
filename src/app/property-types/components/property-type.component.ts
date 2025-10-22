import { Component, inject, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { PropertyTypeService } from '../services/property-type.service';
import { PropertyTypeRequest, PropertyTypeResponse } from '../interfaces/property-type.interface';
import { NewPropertyTypeDialogComponent } from '../dialogs/new-property-type-dialog.component';

@Component({
  selector: 'app-property-type',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule, MatPaginatorModule],
  templateUrl: './property-type.component.html',
  styleUrl: './property-type.component.css'
})
export class PropertyTypeComponent implements OnInit, AfterViewInit {
  private _propertyTypeService = inject(PropertyTypeService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<PropertyTypeResponse>([]);
  isLoading = false;
  errorMessage = '';

  displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor() {
    this.dataSource.paginator = null;
  }

  ngOnInit(): void {
    this.loadPropertyTypes();
  }

  ngAfterViewInit(): void {
  }

  loadPropertyTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this._propertyTypeService.getPropertyTypes().subscribe({
      next: (data) => {
        console.log('Datos cargados:', data.length, 'elementos');
        this.dataSource.data = data;
        this.isLoading = false;

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
    const dialogRef = this.dialog.open(NewPropertyTypeDialogComponent, {
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
    const dialogRef = this.dialog.open(NewPropertyTypeDialogComponent, {
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
        }
      });
    }
  }
}
