import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { PropertiesService } from '../../properties/properties.service';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';

import { EditPropertyDialogComponent } from '../../properties/dialogs/edit-property-dialog/edit-property-dialog.component';
import { NewHouseDialogComponent } from '../../properties/dialogs/new-house-dialog/new-house-dialog.component';

import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { Page } from '../../shared/interfaces/page.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';

@Component({
  standalone: true,
  selector: 'app-property-page',
  imports: [CommonEntityPageComponent, MatIconModule],
  templateUrl: './property-page.component.html',
  styleUrl: './property-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyPageComponent {
  private _propertiesService = inject(PropertiesService);
  private _entityDialogService = inject(EntityDialogService);

  hasToQuery = signal<boolean>(true);
  pageIndex = signal(0);

  propertiesDetailsResource = rxResource({
    loader: () => {
      if (this.hasToQuery()) {
        return this._propertiesService.getPropertiesDetails(this.pageIndex());
      }
      return of(null);
    },
  });

  readonly page = computed<Page<PropertyDetails> | null>(() => {
    const value = this.propertiesDetailsResource.value();
    if (!value) return null;

    return {
      content: value.content,
      total: value.totalElements,
    };
  });

  totalElements = computed<number>(
    () => this.propertiesDetailsResource.value()?.totalElements || 0
  );

  descriptor: CardDescriptor<PropertyDetails> = {
    user: (p) => p.ownerFullName ?? '',
    name: (p) => p.title,
    date: (p) => new Date(),
    id: (p) => p.propertyId,
    status: (p) => (p.deleted ? 'ELIMINADA' : ''),
    coordinates: (p) =>
      p.latitude != null && p.longitude != null
        ? { latitude: p.latitude, longitude: p.longitude }
        : DEFAULT_CENTER,
    secondaryActionLabel: (p) => (p.deleted ? 'Restaurar' : 'Eliminar'),
  };

  openProperty = (id: string | number | undefined) => {
    const property = this.propertiesDetailsResource
      .value()
      ?.content.find((p) => p.propertyId === id);
    if (!property) return;

    this.onUpdate(property);
  };

  deleteOrRestoreProperty = (id: string | number | undefined) => {
    const property = this.propertiesDetailsResource
      .value()
      ?.content.find((p) => p.propertyId === id);
    if (!property) return;

    if (!property.deleted) {
      this.onDelete(property.propertyId);
    } else {
      this.onRestore(property.propertyId);
    }
  };

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.propertiesDetailsResource.reload();
  };

  onCreate() {
    this._entityDialogService
      .openNewEntityDialog(NewHouseDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'house',
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.propertiesDetailsResource.reload();
        }
      });
  }

  onUpdate(property: PropertyDetails) {
    this._entityDialogService
      .openEditEntityDialog(EditPropertyDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'property',
        id: property.propertyId,
        width: '900px',
        data: { property },
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.propertiesDetailsResource.reload();
        }
      });
  }

  onDelete(propertyId: string) {
    this._propertiesService.deleteProperty(propertyId).subscribe(() => {
      this.propertiesDetailsResource.reload();
    });
  }

  onRestore(propertyId: string) {
    this._propertiesService.restoreProperty(propertyId).subscribe(() => {
      this.propertiesDetailsResource.reload();
    });
  }
}
