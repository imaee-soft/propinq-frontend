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
  private _buildingService = inject(BuildingService);

  buildingsResource = rxResource({
    loader: () => {
      return this._buildingService.getBuildings();
    }
  });

  buildingMarkers: Signal<MapMarker[]> = computed(() => (
    this.buildingsResource.value() ?? []).map(building => ({
    id: building.buildingId,
    coordinate: {
      latitude: building.latitude,
      longitude: building.longitude,
    },
    icon: {
      url: '/building.png'
    }
  })));

  markersChange = output<MapMarker[] | null>();

  buildingMarkerQueried = input<MapMarker | null>(null);

  buildingsDetailsResource = rxResource({
    request: this.buildingMarkerQueried,
    defaultValue: null,
    loader: () => {
      const buildingQueried = this.buildingMarkerQueried();
      if (buildingQueried == null) return of(null);
      return this._buildingService.getBuildingDetails(buildingQueried.id);
    }
  });

  buildingDetails = computed(() => this.buildingsDetailsResource.value());

  buildingsDetailsChange = output<BuildingDetails | null>();


 constructor() {

  effect(() => {
      this.markersChange.emit(this.buildingMarkers() || null);
    });
    effect(() =>{
      this.buildingsDetailsChange.emit(this.buildingDetails() || null);
    });
  }
}
