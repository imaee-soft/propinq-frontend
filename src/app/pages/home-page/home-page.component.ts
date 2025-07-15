import { Component, computed, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { BuildingComponent } from '../../buildings/components/building/building.component';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { MapComponent } from '../../maps/components/map/map.component';
import { MapConfig } from '../../maps/interfaces/map-config.interface';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';

@Component({
  imports: [
    MapComponent,
    BuildingComponent,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    MatCardModule,
    MatIcon,
    MatExpansionModule,
    MatButtonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  buildingMarkers = signal<MapMarker[]>;

  private mapConfig: Signal<MapConfig> = computed(() => ({
    center: DEFAULT_CENTER,
    zoom: 14.5,
    enableClick: true,
    enableControls: false,
    markers: this.markers(),
  }));
  markers = signal<MapMarker[]>([]);
  buildingMarkerQueried = signal<MapMarker | null>(null);
  buildingDetails = signal<BuildingDetails | null>(null);

  getMapConfig(): MapConfig {
    return this.mapConfig();
  }

  onMarkerClick({ id, coordinate }: MapMarker): void {
    if (
      !this.buildingMarkerQueried() ||
      this.buildingMarkerQueried()!.id !== id
    ) {
      this.buildingMarkerQueried.set({ id, coordinate });
    }
  }

  onMapMarkersChange(markers: MapMarker[] | null): void {
    this.markers.set(markers || []);
  }

  onBuildingsDetailsChange(buildingDetails: BuildingDetails | null): void {
    this.buildingDetails.set(buildingDetails);
  }

  onMapClick(): void {
    if (this.buildingDetails() !== null) {
      this.buildingMarkerQueried.set(null);
      this.buildingDetails.set(null);
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
    if (this.currentImageIndex() > 0)
      this.currentImageIndex.set(this.currentImageIndex() - 1);
  }

  nextImage() {
    if (this.currentImageIndex() < this.images.length - 1)
      this.currentImageIndex.set(this.currentImageIndex() + 1);
  }
}
