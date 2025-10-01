import { Component, inject, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { LocalityService } from '../../localities/services/locality.service';
import { LocalityResponse } from '../../localities/interfaces/locality.interface';
import { NeighborhoodResponse, NeighborhoodRequest } from '../interfaces/neighborhood.interface';
import { NeighborhoodService } from '../services/neighborhood.service';
import { NewNeighborhoodDialogComponent } from '../dialogs/new-neighborhood-dialog.component';

@Component({
  selector: 'app-neighborhood-crud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule, MatPaginatorModule],
  templateUrl: './neighborhood.component.html',
  styleUrl: './neighborhood.component.css'
})
export class NeighborhoodComponent implements OnInit, AfterViewInit {
  private _neighborhoodService = inject(NeighborhoodService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  private _localityService = inject(LocalityService);
  localityList: LocalityResponse[] = [];
  localitiesGetList = this._localityService.getLocalities().subscribe(
    value => { this.localityList = value }
  );

  getLocalityName(id: string): string {
    let localityName = this.localityList.find(o => o.id == id)?.name;
    return localityName || 'NO SE ENCONTRÓ EL NOMBRE' ;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Variables de estado
  dataSource = new MatTableDataSource<NeighborhoodResponse>([]);
  isLoading = false;
  errorMessage = '';

  // Columnas para mat-table
  displayedColumns: string[] = ['name', 'localityId', 'actions'];

  constructor() {
    // Configurar pageSize por defecto
    this.dataSource.paginator = null;
  }

  ngOnInit(): void {
    this.loadNeighborhoods();
  }

  ngAfterViewInit(): void {
    // El paginador se configurará cuando se carguen los datos
  }

  loadNeighborhoods(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this._neighborhoodService.getNeighborhoods().subscribe({
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
        console.error('Error al cargar barrios:', error);
        this.errorMessage = 'Error al cargar los barrios';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.openCreateDialog();
  }

  onUpdate(neighborhood: NeighborhoodResponse): void {
    this.openEditDialog(neighborhood);
  }

  onDelete(neighborhood: NeighborhoodResponse): void {
    this.deleteNeighborhood(neighborhood.id);
  }

  onRestore(id: string): void {
    this.restoreNeighborhood(id);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(NewNeighborhoodDialogComponent, {
      width: '560px',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.createNeighborhood(result.data);
      }
    });
  }

  openEditDialog(neighborhood: NeighborhoodResponse): void {
    const dialogRef = this.dialog.open(NewNeighborhoodDialogComponent, {
      width: '560px',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      data: { neighborhood, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save') {
        this.updateNeighborhood(neighborhood.id, result.data);
      }
    });
  }

  private createNeighborhood(formValue: NeighborhoodRequest): void {
    this._neighborhoodService.createNeighborhood(formValue).subscribe({
      next: () => {
        this.loadNeighborhoods();
      },
      error: (error) => {
        console.error('Error al crear barrio:', error);
      }
    });
  }

  private updateNeighborhood(id: string, formValue: NeighborhoodRequest): void {
    this._neighborhoodService.updateNeighborhood(id, formValue).subscribe({
      next: () => {
        this.loadNeighborhoods();
      },
      error: (error) => {
        console.error('Error al crear barrio:', error);
      }
    });
  }

  deleteNeighborhood(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta barrio?')) {
      this._neighborhoodService.deleteNeighborhood(id).subscribe({
        next: () => {
          this.loadNeighborhoods();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
        }
      });
    }
  }

  restoreNeighborhood(id: string): void {
    if (confirm('¿Estás seguro de que deseas restaurar esta barrio?')) {
      this._neighborhoodService.restoreNeighborhood(id).subscribe({
        next: () => {
          this.loadNeighborhoods();
        },
        error: (error) => {
          console.error('Error al restaurar:', error);
        }
      });
    }
  }
}
