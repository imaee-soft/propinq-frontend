import { Component, inject, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { LocalityService } from '../services/locality.service';
import { ProvinceService } from '../../provinces/services/province.service';
import { ProvinceResponse } from '../../provinces/interfaces/province.interface';
import { LocalityRequest, LocalityResponse } from '../interfaces/locality.interface';
import { NewLocalityDialogComponent } from '../dialogs/new-locality-dialog.component';

@Component({
  selector: 'app-locality',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule, MatPaginatorModule],
  templateUrl: './locality.component.html',
  styleUrl: './locality.component.css'
})
export class LocalityComponent implements OnInit, AfterViewInit {
  private _localityService = inject(LocalityService);
  private _provinceService = inject(ProvinceService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  provinceList: ProvinceResponse[] = [];
  provincesGetList = this._provinceService.getProvinces().subscribe(
    value => { this.provinceList = value }
  );

  getProvinceName(id: string): string {
    let provinceName = this.provinceList.find(o => o.id == id)?.name;
    return provinceName || 'NO SE ENCONTRÓ EL NOMBRE' ;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Variables de estado
  dataSource = new MatTableDataSource<LocalityResponse>([]);
  isLoading = false;
  errorMessage = '';

  // Columnas para mat-table
  displayedColumns: string[] = ['name', 'provinceId', 'actions'];

  constructor() {
    // Configurar pageSize por defecto
    this.dataSource.paginator = null;
  }

  ngOnInit(): void {
    this.loadLocalities();
  }

  ngAfterViewInit(): void {
    // El paginador se configurará cuando se carguen los datos
  }

  loadLocalities(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this._localityService.getLocalities().subscribe({
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
        console.error('Error al cargar localidades:', error);
        this.errorMessage = 'Error al cargar las localidades';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.openCreateDialog();
  }

  onUpdate(locality: LocalityResponse): void {
    this.openEditDialog(locality);
  }

  onDelete(locality: LocalityResponse): void {
    this.deleteLocality(locality.id);
  }

  onRestore(id: string): void {
    this.restoreLocality(id);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(NewLocalityDialogComponent, {
      width: '560px',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.createLocality(result.data);
      }
    });
  }

  openEditDialog(locality: LocalityResponse): void {
    const dialogRef = this.dialog.open(NewLocalityDialogComponent, {
      width: '560px',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      data: { locality, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.updateLocality(locality.id, result.data);
      }
    });
  }

  private createLocality(formValue: LocalityRequest): void {
    this._localityService.createLocality(formValue).subscribe({
      next: () => {
        this.loadLocalities();
      },
      error: (error) => {
        console.error('Error al crear localidad:', error);
      }
    });
  }

  private updateLocality(id: string, formValue: LocalityRequest): void {
    this._localityService.updateLocality(id, formValue).subscribe({
      next: () => {
        this.loadLocalities();
      },
      error: (error) => {
        console.error('Error al crear localidad:', error);
      }
    });
  }

  deleteLocality(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta localidad?')) {
      this._localityService.deleteLocality(id).subscribe({
        next: () => {
          this.loadLocalities();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
        }
      });
    }
  }

  restoreLocality(id: string): void {
    if (confirm('¿Estás seguro de que deseas restaurar esta localidad?')) {
      this._localityService.restoreLocality(id).subscribe({
        next: () => {
          this.loadLocalities();
        },
        error: (error) => {
          console.error('Error al restaurar:', error);
        }
      });
    }
  }
}
