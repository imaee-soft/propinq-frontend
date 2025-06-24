import { Component, computed, inject, Input, output, signal } from '@angular/core';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { BuildingComponent } from '../../buildings/components/building.component';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { MapConfig } from '../../maps/interfaces/map-config.interface';

@Component({
  selector: 'app-home-page',
  imports: [MapComponent, BuildingComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {

  buildingMarkers = signal<MapMarker[]>;
  mapConfig = signal<MapConfig>(DEFAULT_MAP_CONFIG);
  buildingMarkerQueried = signal<MapMarker | null>(null);

 onMarkerClick({ id, coordinate }: MapMarker): void {
    console.log(`Marker clicked: ${id} at (${coordinate.latitude}, ${coordinate.longitude})`);
    this.buildingMarkerQueried.set({ id, coordinate });
 }
 onMapConfigChange(newConfig: MapConfig): void{

 }

}
