import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, Signal } from '@angular/core';
import { BuildingService } from '../services/building.service';
import { DEFAULT_CENTER, DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { MapConfig } from '../../maps/interfaces/map-config.interface';
import { of } from 'rxjs';
import { BuildingDetails } from '../interfaces/building-details.interface';


@Component({
  selector: 'app-building-component',
  imports: [],
  template: ``,
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
    icon: {
      url: '/building.png'
    }
  })));

  private mapConfig: Signal<MapConfig> = computed(() => ({
    center: DEFAULT_CENTER,
    zoom: 14.5,
    enableClick: true,
    enableControls: false,
    markers: this.buildingMarkers()
  }));

  mapConfigChange = output<MapConfig>();

  buildingMarkerQueried = input<MapMarker | null>(null);

  buildingsDetailsResource = rxResource({
    request: this.buildingMarkerQueried,
    defaultValue: null,
    loader: () => {
      const buildingQueried = this.buildingMarkerQueried();
      if (buildingQueried == null) return of(null);
      return this.buildingService.getBuildingDetails(buildingQueried.id);
    }
  });

  buildingDetails = computed(() => this.buildingsDetailsResource.value());

  buildingsDetailsChange = output<BuildingDetails | null>();

 constructor() {
    effect(() => {
    this.mapConfigChange.emit(this.mapConfig());
    });
    effect(() =>{
      this.buildingsDetailsChange.emit(this.buildingDetails() || null);
    });
    effect(() => {console.log(`Building details: ${JSON.stringify(this.buildingDetails())}`);});
  }
}
