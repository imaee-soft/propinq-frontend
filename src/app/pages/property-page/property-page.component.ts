import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { PropertiesService } from '../../properties/properties.service';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';

import { EditPropertyDialogComponent } from '../../properties/dialogs/edit-property-dialog/edit-property-dialog.component';
import { NewHouseDialogComponent } from '../../properties/dialogs/new-house-dialog/new-house-dialog.component';

import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-property-page',
  imports: [CommonEntityPageComponent, MatIconModule],
  templateUrl: './property-page.component.html',
  styleUrl: './property-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyPageComponent implements OnInit {
  private _propertiesService = inject(PropertiesService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);
  private _entityDialogService = inject(EntityDialogService);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  properties = signal<PropertyDetails[]>([]);
  totalElements = signal(0);

  descriptor: CardDescriptor<PropertyDetails> = {
    user: (p) => p.ownerFullName ?? '',
    name: (p) => p.title,
    date: (p) => new Date(),
    id: (p) => p.propertyId,
    status: (p) => (p.deleted ? 'DELETED' : 'ACTIVE'),
    coordinates: (p) =>
      p.latitude != null && p.longitude != null
        ? { latitude: p.latitude, longitude: p.longitude }
        : DEFAULT_CENTER,
  };

  ngOnInit(): void {
    this.loadProperties();
  }

  create() {
    console.log('Creating property');
    this._entityDialogService
      .openNewEntityDialog(NewHouseDialogComponent, {
        panelClass: 'generic-dialog',
        backdropClass: 'dialog-backdrop',
        entity: 'house',
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.resetPage();
          this.loadProperties();
        }
      });
  }

  loadProperties() {
    if (!this.canQuery()) return;
    this._propertiesService
      .getPropertiesDetails(this.pageIndex())
      .pipe(
        tap((newProperties) => {
          this.properties.set([...this.properties(), ...newProperties.content]);
          this.totalElements.set(newProperties.totalElements);
          if (newProperties.totalElements === this.properties().length)
            this.canQuery.set(false);
        }),
      )
      .subscribe();
  }

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.loadProperties();
  };

  primaryAction = (id: string | number | undefined) => {
    const property = this.properties().find((p) => p.propertyId === id);
    if (!property) return;
    this.update(property);
  };

  update(property: PropertyDetails) {
    this._entityDialogService
      .openEditEntityDialog(EditPropertyDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'property',
        id: property.propertyId,
        backdropClass: 'dialog-backdrop',
        width: '900px',
        data: { property },
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.resetPage();
          this.loadProperties();
        }
      });
  }

  secondaryAction = (id: string | number | undefined) => {
    const property = this.getProperty(id);
    if (!property) return;
    this._router.navigate(['/properties', property.propertyId]);
  };

  thirdActionLabel = (id: string | number | undefined): string => {
    const property = this.getProperty(id);
    if (!property) return '';
    return property.deleted ? 'Restaurar' : 'Eliminar';
  };

  thirdAction = (id: string | number | undefined) => {
    const property = this.getProperty(id);
    if (!property) return;
    if (!property.deleted) {
      this.delete(property.propertyId);
    } else {
      this.restore(property.propertyId);
    }
  };

  delete(propertyId: string) {
    this._propertiesService.deleteProperty(propertyId).subscribe(() => {
      this._notificationService.success(
        'La vivienda fue eliminada correctamente',
      );
      this.resetPage();
      this.loadProperties();
    });
  }

  restore(propertyId: string) {
    this._propertiesService.restoreProperty(propertyId).subscribe(() => {
      this._notificationService.success(
        'La vivienda fue restaurada correctamente',
      );
      this.resetPage();
      this.loadProperties();
    });
  }

  private getProperty(propertyId: string | number | undefined) {
    return this.properties().find((p) => p.propertyId === propertyId);
  }

  private resetPage() {
    this.properties.set([]);
    this.totalElements.set(0);
    this.pageIndex.set(0);
    this.canQuery.set(true);
  }
}
