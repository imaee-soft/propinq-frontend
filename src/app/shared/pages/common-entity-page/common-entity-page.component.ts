import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { STATUS_MAP, StatusConfig } from '../../../contacts/contacts.utils';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';
import { CardDescriptor } from '../../interfaces/card-descriptor.interface';
import { formatDate } from '../../utilities/date.pipes';

@Component({
  selector: 'common-entity-page',
  templateUrl: 'common-entity-page.component.html',
  styleUrls: ['common-entity-page.component.css'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MapComponent,
    CommonModule,
  ],
})
export class CommonEntityPageComponent<T extends object> {
  elements = input<T[]>();
  descriptor = input<CardDescriptor<T>>();
  primaryActionLabel = input<string>('Acción 1');
  primaryAction = input<(id: string | number | undefined) => void>();
  secondaryActionLabel = input<string>('Acción 2');
  canExecuteSecondaryAction = input<(entity: T) => boolean>(() => true);
  secondaryAction = input<(id: string | number | undefined) => void>();
  thirdActionLabel = input<string>('Acción 3');
  thirdAction = input<(id: string | number | undefined) => void>();
  canExecuteThirdAction = input<(entity: T) => boolean>(() => true);

  iconUrl = input<string>('/building.png');
  pageTitle = input<string>('Consulta');
  allLoadedLabel = input<string>(
    'Estas son todas las solicitudes de contacto.'
  );

  hasMoreEntities = input<boolean>(true);
  loadMoreLabel = input<string>('Recuperar más solicitudes');
  loadMoreEntities = input<() => void>();

  newEntityLabel = input<string>('Nueva entidad');
  newEntity = input<() => void>();

  cards = computed(() => this.elements() ?? []);

  private _mapConfigs = new WeakMap<T, MapConfig>();

  goBack() {
    window.history.back();
  }

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
  }

  getStatus(entity: T) {
    const status = this.descriptor()?.status?.(entity);
    if (!status) return 'Desconocido';
    return status;
  }

  getStatusConfig(entity: T): StatusConfig | null {
    const status = this.descriptor()?.status?.(entity);
    if (!status) return null;
    return STATUS_MAP[status] ?? null;
  }

  loadMapConfig(entity: T): MapConfig {
    if (!this._mapConfigs.has(entity)) {
      const coords = this.descriptor()?.coordinates(entity) ?? DEFAULT_CENTER;
      this._mapConfigs.set(entity, {
        center: coords,
        zoom: 30,
        markers: [
          {
            type: 'building',
            coordinate: coords,
            icon: { url: this.iconUrl() },
          },
        ],
      });
    }
    return this._mapConfigs.get(entity)!;
  }
}
