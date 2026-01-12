import { Injectable, signal } from '@angular/core';
import { MapCoordinate } from '../interfaces/map-coordinate.interface';
import { DEFAULT_CENTER } from '../utils/constants';

@Injectable({providedIn: 'root'})
export class UserLocationService {

    userLocation = signal<MapCoordinate>(DEFAULT_CENTER);

    constructor() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation.set({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
              this.userLocation.set(DEFAULT_CENTER);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }

    getUserLocation(): MapCoordinate {
        return this.userLocation();
    }
}
