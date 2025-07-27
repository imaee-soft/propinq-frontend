import { Component, computed, Signal, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_CENTER, DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
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
  private router = inject(Router);

  buildingMarkers = signal<MapMarker[]>([]);

  private mapConfig: Signal<MapConfig> = computed(() => ({
    center: DEFAULT_CENTER,
    zoom: 14.5,
    enableClick: true,
    enableControls: false,
    markers: this.markers()
  }));
  markers = signal<MapMarker[]>([]);
  buildingMarkerQueried = signal<MapMarker | null>(null);
  buildingDetails = signal<BuildingDetails | null>(null);

  getMapConfig(): MapConfig {
    return this.mapConfig();
  }

  goToAdminPanel(): void {
    console.log('Navegando a property-types...');
    console.log('URL actual:', this.router.url);
    this.router.navigateByUrl('/property-types').then(
      (success) => console.log('Navegación exitosa:', success),
      (error) => console.error('Error en navegación:', error)
    );
  }

  onMarkerClick({ id, coordinate }: MapMarker): void {
    if (!this.buildingMarkerQueried() || this.buildingMarkerQueried()!.id !== id) {
      this.buildingMarkerQueried.set({ id, coordinate });
    }
 }

 onMapMarkersChange(markers: MapMarker[] | null): void{
   this.markers.set(markers || []);
 }

 onBuildingsDetailsChange(buildingDetails: BuildingDetails | null): void {
  this.buildingDetails.set(buildingDetails);
 }

 onMapClick(): void {
   if(this.buildingDetails() !== null) {
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
  if (this.currentImageIndex() > 0) this.currentImageIndex.set(this.currentImageIndex() - 1);
}

nextImage() {
  if (this.currentImageIndex() < this.images.length - 1) this.currentImageIndex.set(this.currentImageIndex() + 1);
}

}
