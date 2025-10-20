import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { MapMarker } from '../../../maps/interfaces/map-marker.interface';
import { BuildingsService } from '../../buildings.service';
import { FiltersService } from '../../../shared/services/filters.service';
import { BuildingDetails } from '../../interfaces/building-details.interface';
import { PropertyDetails } from '../../../properties/interfaces/property-details.interface';


@Component({
  selector: 'app-building-component',
  imports: [],
  template: ``,
  styleUrl: './building.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingComponent {
  private _buildingsService = inject(BuildingsService);
  private _filtersService = inject(FiltersService);

  buildingsResource = rxResource({
    loader: () => {
      return this._buildingsService.getBuildings();
    },
  });

  buildingMarkers: Signal<MapMarker[]> = computed(() =>
    (this.buildingsResource.value() ?? []).map((building) => ({
      id: building.buildingId,
      coordinate: {
        latitude: building.latitude,
        longitude: building.longitude,
      },
      icon: {
        url: '/building.png',
      },
      type: 'building',
    }))
  );

  markersChange = output<MapMarker[] | null>();

  buildingMarkerQueried = input<MapMarker | null>(null);

  buildingDetailsResource = rxResource({
    request: this.buildingMarkerQueried,
    defaultValue: null,
    loader: () => {
      const buildingQueried = this.buildingMarkerQueried();
      if (buildingQueried == null || !buildingQueried.id) return of(null);
      return this._buildingsService.getBuildingDetails(buildingQueried.id);
    },
  });

  buildingPropertiesResource = rxResource({
    request: this.buildingMarkerQueried,
    defaultValue: [],
    loader: () => {
      const buildingQueried = this.buildingMarkerQueried();
      if (buildingQueried == null || !buildingQueried.id) return of([]);
      const attrs = {
        priceMin: this._filtersService.filterPriceMin() ?? undefined,
        priceMax: this._filtersService.filterPriceMax() ?? undefined,
        bedrooms: this._filtersService.filterRooms() ?? undefined,
        bathrooms: this._filtersService.filterBathrooms() ?? undefined,
        petsAllowed: this._filtersService.filterAllowPets() ?? undefined,
      };
      return this._buildingsService.getBuildingProperties(buildingQueried.id, attrs);
    },
  });

  buildingDetails = computed(() => this.buildingDetailsResource.value());

  buildingProperties = computed(() => this.buildingPropertiesResource.value());

  buildingDetailsChange = output<BuildingDetails | null>();

  buildingPropertiesChange = output<PropertyDetails[] | null>();

  constructor() {
    effect(() => {
      this.markersChange.emit(this.buildingMarkers() || null);
    });
    effect(() => {
      this.buildingDetailsChange.emit(this.buildingDetails() || null);
    });
    effect(() => {
      this.buildingPropertiesChange.emit(this.buildingProperties() || null);
    });
  }

}
