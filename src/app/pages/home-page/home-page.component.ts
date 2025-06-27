import { Component, computed, inject, Input, output, signal } from '@angular/core';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { BuildingComponent } from '../../buildings/components/building.component';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { MapConfig } from '../../maps/interfaces/map-config.interface';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MapComponent, BuildingComponent, MatDrawerContainer, MatDrawerContent, MatDrawer, MatCardModule, MatIcon, MatExpansionModule, MatButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {

  buildingMarkers = signal<MapMarker[]>;
  mapConfig = signal<MapConfig>(DEFAULT_MAP_CONFIG);
  buildingMarkerQueried = signal<MapMarker | null>(null);
  buildingDetails = signal<BuildingDetails | null>(null);

  onMarkerClick({ id, coordinate }: MapMarker): void {
    console.log(`Marker clicked: ${id} at (${coordinate.latitude}, ${coordinate.longitude})`);

    if (!this.buildingMarkerQueried() || this.buildingMarkerQueried()!.id !== id) {
      this.buildingMarkerQueried.set({ id, coordinate });
      console.log(`Building marker queried: ${this.buildingMarkerQueried()}`);
    }
 }

 onMapConfigChange(newConfig: MapConfig): void{
   this.mapConfig.set(newConfig);
 }

 onBuildingsDetailsChange(buildingDetails: BuildingDetails | null): void {
  this.buildingDetails.set(buildingDetails);
  console.log(`Building details updated: ${JSON.stringify(buildingDetails)}`);
 }

 onMapClick(): void {
   console.log(`Map clicked`);
   if(this.buildingDetails() !== null) {
    this.buildingMarkerQueried.set(null);
    this.buildingDetails.set(null);
    console.log(`Building marker and details reset`);
  }
 }
 onCloseDetails(): void {
  this.buildingMarkerQueried.set(null);
  this.buildingDetails.set(null);
  this.currentImageIndex.set(0);
 }

currentImageIndex = signal(0);

get images() {
  return this.buildingDetails()?.imagesURL ?? [];
}

prevImage() {
  if (this.currentImageIndex() > 0) this.currentImageIndex.set(this.currentImageIndex() - 1);
}

nextImage() {
  if (this.currentImageIndex() < this.images.length - 1) this.currentImageIndex.set(this.currentImageIndex() + 1);
}

}
