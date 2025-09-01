import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, Signal } from "@angular/core";
import { PropertiesService } from "../properties.service";
import { rxResource } from "@angular/core/rxjs-interop";
import { MapMarker } from "../../maps/interfaces/map-marker.interface";
import { of } from "rxjs";
import { PropertyDetails } from "../interfaces/property-details.interface";

@Component({
  selector: 'app-property-component',
  imports: [],
  template: ``,
  styleUrl: './property.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyComponent {

  private _propertiesService = inject(PropertiesService);

  propertiesResource = rxResource({
    loader: () => {
      return this._propertiesService.getProperties();
    },
  });

  propertyMarkers: Signal<MapMarker[]> = computed(() =>
  (this.propertiesResource.value() ?? []).map((property) => ({
    id: property.propertyId,
    coordinate: {
      latitude: property.latitude,
      longitude: property.longitude
    },
    icon: {
      url: '/property.png'
    },
    type: 'property'
  }))
  );

  markersChange = output<MapMarker[] | null>();

  propertyMarkerQueried = input<MapMarker | null>(null);

  propertyDetailsResource = rxResource({
    request: this.propertyMarkerQueried,
    defaultValue: null,
    loader: () => {
      const propertyQueried = this.propertyMarkerQueried();
      if(propertyQueried == null || !propertyQueried.id) return of(null);
      return this._propertiesService.getPropertyDetails(propertyQueried.id);
    },
  });

  propertyDetails = computed(() => this.propertyDetailsResource.value());

  propertyDetailsChange = output<PropertyDetails | null>();

   constructor() {
    effect(() => {
      this.markersChange.emit(this.propertyMarkers() || null);
    });

    effect(() => {
      this.propertyDetailsChange.emit(this.propertyDetails() || null);
    });

  }
}
