import { Component, computed, input, Input, OnInit } from '@angular/core';
import { CardDescriptor } from '../../interfaces/card-descriptor.interface';
import { Page } from '../../interfaces/page.interface';
import { MatCard, MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { MapComponent } from '../../../maps/components/map/map.component';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';
import { formatDate } from '../../utilities/date.pipes';

@Component({
  selector: 'common-entity-page',
  templateUrl: 'common-entity-page.component.html',
  styleUrls: ['common-entity-page.component.css'],
  imports: [MatCardModule, MatIconModule, MatButtonModule, MapComponent],
})
export class CommonEntityPageComponent<T extends object> {
  page = input<Page<T>>();
  descriptor = input<CardDescriptor<T>>();
  onOpen = input<(id: string | number | undefined) => void>();
  onDelete = input<(id: string | number | undefined) => void>();

  cards = computed(() => this.page()?.content ?? []);
  total = computed(() => this.page()?.total ?? null);
  hasMore = computed(() => {
    const total = this.total();
    if (total === null) return true;
    return this.cards().length < total;
  });

  private _mapConfigs = new WeakMap<T, MapConfig>();

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
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
            icon: { url: '/building.png' },
          },
        ],
      });
    }
    return this._mapConfigs.get(entity)!;
  }
}
