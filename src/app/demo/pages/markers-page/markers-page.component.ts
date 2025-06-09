import { Component, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapClickEvent } from '../../../maps/interfaces/click-event.interface';
import { MapMarker } from '../../../maps/interfaces/map-marker.interface';

@Component({
  selector: 'app-markers-page',
  imports: [MapComponent],
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css'],
})
export class MarkersPageComponent {
  private _snackBar = inject(MatSnackBar);
  private _markers = signal<MapMarker[]>([]);

  mapConfig = computed(() => ({
    markers: this._markers(),
    enableClick: true,
  }));

  onMapClick({ coordinate }: MapClickEvent): void {
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

  onMarkerClick({ title, coordinate }: MapMarker): void {
    this._snackBar.open(
      `${title} clicked at coordinates (${coordinate.latitude}, ${coordinate.longitude})`,
      'Close',
      {
        duration: 1500,
        panelClass: ['marker-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
  }
}
