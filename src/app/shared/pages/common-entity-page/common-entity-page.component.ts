import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { STATUS_MAP, StatusConfig } from '../../../contacts/contacts.utils';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';
import { CardDescriptor } from '../../interfaces/card-descriptor.interface';
import { formatDate } from '../../utilities/date.pipes';

export interface ChipFilter {
  id: string;
  label: string;
}

@Component({
  selector: 'common-entity-page',
  templateUrl: 'common-entity-page.component.html',
  styleUrls: ['common-entity-page.component.css'],
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MapComponent,
    CommonModule,
    MatTooltip,
  ],
})
export class CommonEntityPageComponent<T extends object> {
  elements = input<T[]>();
  descriptor = input<CardDescriptor<T>>();
  chipFilters = input<ChipFilter[]>();

  primaryActionLabel = input<string>('Acción 1');
  primaryAction = input<(id: string | number | undefined) => void>();
  secondaryActionLabel = input<string>('Acción 2');
  canExecuteSecondaryAction = input<(entity: T) => boolean>(() => true);
  secondaryAction = input<(id: string | number | undefined) => void>();
  thirdActionLabel = input<(id: string | number | undefined) => string>(
    () => 'Acción 3',
  );
  thirdAction = input<(id: string | number | undefined) => void>();
  canExecuteThirdAction = input<(entity: T) => boolean>(() => true);

  iconUrl = input<string>('/building.png');
  pageTitle = input<string>('Consulta');
  allLoadedLabel = input<string>(
    'Estas son todas las solicitudes de contacto.',
  );

  hasMoreEntities = input<boolean>(true);
  loadMoreLabel = input<string>('Recuperar más solicitudes');
  loadMoreEntities = input<() => void>();

  newEntityLabel = input<string>('Nueva entidad');
  newEntity = input<() => void>();
  zeroEntitiesLabel = input<string>('No hay entidades para mostrar.');
  createFirstEntityLabel = input<string>('Crear la primera entidad');

  currentFilter = input<ChipFilter | undefined>(undefined);
  changeFilter = output<ChipFilter>();

  filterByText = input<boolean>(false);
  filterChange = output<string>();

  textFilter = signal('');

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
