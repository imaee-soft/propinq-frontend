import { Component, computed, OnInit as NgOnInit, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapMarker } from '../../../maps/interfaces/map-marker.interface';

@Component({
  selector: 'app-user-position-page',
  imports: [MapComponent, MatProgressSpinner],
  templateUrl: './user-position-page.component.html',
})
export class UserPositionPageComponent implements NgOnInit {
  private _marker = signal<MapMarker>({
    id: 'user-position',
    coordinate: { latitude: 0, longitude: 0 },
  });

  isLoading = signal<boolean>(true);
  mapConfig = computed(() => ({
    center: this._marker().coordinate,
    markers: [this._marker()],
    enableClick: true,
  }));

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => this.handlePositionSuccess(position),
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  private handlePositionSuccess(position: GeolocationPosition): void {
    this.isLoading.set(false);
    this._marker.update((marker) => ({
      ...marker,
      coordinate: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    }));
    console.log('User position:', this._marker().coordinate);
  }
}
