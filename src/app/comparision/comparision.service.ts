import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComparePropertiesDialogComponent } from '../properties/dialogs/compare-properties-dialog/compare-properties-dialog.component';
import { PropertyDetails } from '../properties/interfaces/property-details.interface';
import { NotificationService } from '../shared/services/notification.service';

const comparativeItems = [
  { label: 'Precio', key: 'price', enabled: true, priority: 1 },
  { label: 'Superficie (m²)', key: 'area', enabled: true, priority: 2 },
  { label: 'Ambientes', key: 'bedrooms', enabled: true, priority: 3 },
  { label: 'Baños', key: 'bathrooms', enabled: false, priority: 4 },
  {
    label: 'Mascotas',
    key: 'petsAllowed',
    enabled: false,
    priority: 5,
  },
];

@Injectable({ providedIn: 'root' })
export class ComparisionService {
  private _notificationService = inject(NotificationService);
  private _matDialog = inject(MatDialog);

  properties = signal<PropertyDetails[]>([]);

  addToComparativeList(property: PropertyDetails) {
    if (!property) return;
    if (this.properties().find((p) => p.propertyId === property.propertyId)) {
      this._notificationService.error(
        'La vivienda ya está agregada a la comparación',
        1500,
      );
      return;
    }
    this.properties.set([...this.properties(), property]);
    this._notificationService.success(
      'Vivienda agregada a la comparación',
      1500,
    );
  }

  removeFromComparative(index: number) {
    const arr = [...this.properties()];
    arr.splice(index, 1);
    this.properties.set(arr);
  }

  clearComparativeList() {
    this.properties.set([]);
  }

  openComparisonDialog() {
    if (this.properties().length < 2) return;
    const attrs = localStorage.getItem('compareAttributes');
    const userCompareAttributes = attrs ? JSON.parse(attrs) : comparativeItems;
    return this._matDialog.open(ComparePropertiesDialogComponent, {
      data: {
        properties: this.properties(),
        compareAttributes: userCompareAttributes,
      },
      width: '90vw',
      maxWidth: '99vw',
      panelClass: 'compare-dialog-panel',
    });
  }
}
