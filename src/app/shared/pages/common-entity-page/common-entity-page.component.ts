import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';
import { CardDescriptor } from '../../interfaces/card-descriptor.interface';
import { formatDate } from '../../utilities/date.pipes';

interface StatusConfig {
  label: string;
  color: string;
  background: string;
  border: string;
}

const STATUS_MAP: { [key: string]: StatusConfig } = {
  CREATED: {
    label: 'Creada',
    color: '#fde68a',
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
  },
  REJECTED: {
    label: 'Rechazada',
    color: '#fca5a5',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
  },
  ACCEPTED: {
    label: 'Aprobada',
    color: '#6ee7b7',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
  },
};

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
  onOpen = input<(id: string | number | undefined) => void>();
  onDelete = input<(id: string | number | undefined) => void>();
  primaryActionLabel = input<string>('Ver');
  allLoadedText = input<string>('Estas son todas las solicitudes de contacto.');
  loadMoreLabel = input<string>('Recuperar más solicitudes');
  iconUrl = input<string>('/building.png');

  pageTitle = input<string>('Consulta');
  newEntity = input<() => void>();
  newEntityLabel = input<string>('Nueva entidad');

  hasMoreEntities = input<boolean>(true);
  moreEntities = input<() => void>();

  cards = computed(() => this.elements() ?? []);

  private _mapConfigs = new WeakMap<T, MapConfig>();

  goBack() {
    window.history.back();
  }

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
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
