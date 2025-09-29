import { Component, computed, inject, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { BuildingComponent } from '../../buildings/components/building/building.component';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { MapComponent } from '../../maps/components/map/map.component';
import { MapConfig } from '../../maps/interfaces/map-config.interface';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { PropertyComponent } from '../../properties/components/property.component';
import { ComparePropertiesDialogComponent } from '../../properties/dialogs/compare-properties-dialog/compare-properties-dialog.component';
import { NewPropertyDialogComponent } from '../../properties/dialogs/new-property-dialog/new-property-dialog.component';
import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { CustomSnackbarService } from '../../shared/services/snackbar.service';

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
    MatGridListModule,
    MatTooltipModule,
    PropertyComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private router = inject(Router);
  private snackbar = inject(CustomSnackbarService);
  private authService = inject(AuthService);
  private _entityDialogService = inject(EntityDialogService);

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

  propertyMarkerQueried = signal<MapMarker | null>(null);
  propertyDetails = signal<PropertyDetails | null>(null);

  buildingProperties = signal<PropertyDetails[] | null>(null);

  isOwner = computed(
    () => this.buildingDetails()?.userId === this.authService.user()?.userId
  );

  private dialog = inject(MatDialog);

  getMapConfig(): MapConfig {
    return this.mapConfig();
  }

  onMarkerClick(marker: MapMarker): void {
    if (marker.type === 'building') {
      this.propertyMarkerQueried.set(null);
      this.propertyDetails.set(null);
      this.onBuildingMarkerClick(marker);
    } else if (marker.type === 'property') {
      this.buildingMarkerQueried.set(null);
      this.buildingDetails.set(null);
      this.onPropertyMarkerClick(marker);
    }
  }

  onBuildingMarkerClick(marker: MapMarker): void {
    if (
      (marker.type === 'building' && !this.buildingMarkerQueried()) ||
      this.buildingMarkerQueried()!.id !== marker.id
    ) {
      this.comparativeDrawerOpen.set(false);
      this.buildingMarkerQueried.set({
        id: marker.id,
        coordinate: marker.coordinate,
        type: marker.type,
      });
    }
  }

  onPropertyMarkerClick(marker: MapMarker): void {
    if (
      (marker.type === 'property' && !this.propertyMarkerQueried()) ||
      this.propertyMarkerQueried()!.id !== marker.id
    ) {
      this.comparativeDrawerOpen.set(false);

      this.propertyMarkerQueried.set({
        id: marker.id,
        coordinate: marker.coordinate,
        type: marker.type,
      });
    }
  }

  onMapMarkersChange(markers: MapMarker[] | null): void {
    this.markers.set([
      ...(this.getMapConfig().markers ?? []),
      ...(markers ?? []),
    ]);
  }

  onBuildingDetailsChange(buildingDetails: BuildingDetails | null): void {
    this.buildingDetails.set(buildingDetails);
  }

  onPropertyDetailsChange(propertyDetails: PropertyDetails | null): void {
    this.propertyDetails.set(propertyDetails);
  }

  onBuildingPropertiesChange(properties: PropertyDetails[] | null): void {
    this.buildingProperties.set(properties);
  }

  onMapClick(): void {
    if (this.buildingDetails() !== null || this.propertyDetails() !== null) {
      this.buildingMarkerQueried.set(null);
      this.buildingDetails.set(null);
      this.propertyMarkerQueried.set(null);
      this.propertyDetails.set(null);
    }
  }
  onCloseDetails(): void {
    if (this.buildingDetails() !== null || this.propertyDetails() !== null) {
      this.buildingMarkerQueried.set(null);
      this.buildingDetails.set(null);
      this.propertyMarkerQueried.set(null);
      this.propertyDetails.set(null);
    }

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

  public propertyGalleryOpen = signal(false);
  public propertyGalleryImages = signal<string[]>([]);
  public propertyGalleryIndex = signal(0);

  public openPropertyGallery(images: string[], startIndex = 0) {
    this.propertyGalleryOpen.set(true);
    this.propertyGalleryImages.set(images ?? []);
    this.propertyGalleryIndex.set(startIndex);
  }

  public closePropertyGallery() {
    this.propertyGalleryOpen.set(false);
    this.propertyGalleryImages.set([]);
    this.propertyGalleryIndex.set(0);
  }

  public prevGalleryImage() {
    if (this.propertyGalleryIndex() > 0)
      this.propertyGalleryIndex.set(this.propertyGalleryIndex() - 1);
  }

  public nextGalleryImage() {
    if (this.propertyGalleryIndex() < this.propertyGalleryImages().length - 1)
      this.propertyGalleryIndex.set(this.propertyGalleryIndex() + 1);
  }

  goToProperty(propertyId: string) {
    if (!propertyId) return;
    this.router.navigate(['/properties', propertyId]);
  }

  comparativeList = signal<PropertyDetails[]>([]);

  addToComparativeList(property: PropertyDetails) {
    if (!property) return;
    if (
      this.comparativeList().find((p) => p.propertyId === property.propertyId)
    ) {
      this.snackbar.error(
        'La Vivienda ya está agregada a la Comparación',
        1500
      );
      return;
    }
    this.comparativeList.set([...this.comparativeList(), property]);
    this.snackbar.success('Vivienda Agregada a la Comparación', 1500);
  }

  public comparativeDrawerOpen = signal(false);

  openComparativeDrawer() {
    this.buildingMarkerQueried.set(null);
    this.propertyMarkerQueried.set(null);
    this.comparativeDrawerOpen.set(true);
  }
  closeComparativeDrawer() {
    this.comparativeDrawerOpen.set(false);
  }
  removeFromComparative(index: number) {
    const arr = [...this.comparativeList()];
    arr.splice(index, 1);
    this.comparativeList.set(arr);
  }
  clearComparativeList() {
    this.comparativeList.set([]);
  }

  openComparisonDialog() {
    if (this.comparativeList().length < 2) return;
    this.closeComparativeDrawer();
    const attrs = localStorage.getItem('compareAttributes');
    const userCompareAttributes = attrs
      ? JSON.parse(attrs)
      : [
          { label: 'Precio', key: 'price', enabled: true, priority: 1 },
          { label: 'Superficie (m²)', key: 'area', enabled: true, priority: 2 },
          { label: 'Ambientes', key: 'bedrooms', enabled: true, priority: 3 },
          { label: 'Baños', key: 'bathrooms', enabled: false, priority: 4 },
          {
            label: 'Mascotas',
            key: 'petsAllowed',
            enabled: false,
            priority: 5,
          },
        ];
    this.dialog.open(ComparePropertiesDialogComponent, {
      data: {
        properties: this.comparativeList(),
        compareAttributes: userCompareAttributes,
      },
      width: '90vw',
      maxWidth: '99vw',
      panelClass: 'compare-dialog-panel',
    });
    this.comparativeList.set([]);
  }

  openNewPropertyDialog() {
    this._entityDialogService
      .openNewEntityDialog(NewPropertyDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'property',
        data: {
          buildingId: this.buildingDetails()?.buildingId ?? '',
          buildingName: this.buildingDetails()?.name ?? '',
        },
      })
      .subscribe();
  }
}
