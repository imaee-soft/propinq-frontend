import { Component, computed, signal } from '@angular/core';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapClickEvent } from '../../../maps/interfaces/click-event.interface';
import { MapMarker } from '../../../maps/interfaces/marker.interface';

@Component({
  selector: 'app-markers-page',
  imports: [MapComponent],
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent {
  private _markers = signal<MapMarker[]>([]);
  mapConfig = computed(() => ({
    markers: this._markers(),
    enableClick: true,
  }));

  onMapClick({ coordinate }: MapClickEvent): void {
    console.log('Map clicked at:', coordinate);
    this._markers.update((markers) => [
      ...markers,
      {
        id: `${markers.length + 1}`,
        coordinate,
        title: `Marker ${markers.length + 1}`,
        icon: {
          url: 'https://openlayers.org/en/latest/examples/data/icon.png',
        },
      },
    ]);
  }

  onMarkerClick(marker: MapMarker): void {
    console.log('Marker clicked:', marker);
  }
}
