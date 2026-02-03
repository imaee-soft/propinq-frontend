import { inject, Injectable, signal } from '@angular/core';
import { PropertyDetails } from '../properties/interfaces/property-details.interface';
import { NotificationService } from '../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class ComparisionService {
  private _notificationService = inject(NotificationService);

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

  isBeingCompared(propertyId: string): boolean {
    return !!this.properties().find((p) => p.propertyId === propertyId);
  }

  clearComparativeList() {
    this.properties.set([]);
  }
}
