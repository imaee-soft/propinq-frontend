import { Building } from './../interfaces/building.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, Signal } from '@angular/core';
import { BuildingService } from '../services/building.service';
import { DEFAULT_CENTER, DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { MapConfig } from '../../maps/interfaces/map-config.interface';


@Component({
  selector: 'app-building-component',
  imports: [],
  template: `<p>building-page works!</p>`,
  styleUrl: './building.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingComponent {
  buildingService = inject(BuildingService);

  buildingsResource = rxResource({
    loader: () => {
      return this.buildingService.getBuildings();
    }
  });

  buildingMarkers: Signal<MapMarker[]> = computed(() => (this.buildingsResource.value() ?? []).map(building => ({
    id: building.buildingId,
    coordinate: {
      latitude: building.latitude,
      longitude: building.longitude,
    },
  })));

  private mapConfig: Signal<MapConfig> = computed(() => ({
      center: DEFAULT_CENTER,
      zoom: 14.5,
      enableClick: true,
      enableControls: false,
      markers: this.buildingMarkers()
  }));

  mapConfigChange = output<MapConfig>();

  constructor() {
    effect(() => {
    this.mapConfigChange.emit(this.mapConfig());
    });
  }

  buildingMarkerQueried = input<MapMarker | null>(null);

}


