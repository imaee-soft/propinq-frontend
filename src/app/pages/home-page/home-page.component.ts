import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
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
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { Role } from '../../auth/enums/role.enum';
import { BuildingsService } from '../../buildings/buildings.service';
import { BuildingComponent } from '../../buildings/components/building/building.component';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { MapComponent } from '../../maps/components/map/map.component';
import { MapClickEvent } from '../../maps/interfaces/click-event.interface';
import { MapConfig } from '../../maps/interfaces/map-config.interface';
import { MapCoordinate } from '../../maps/interfaces/map-coordinate.interface';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { PropertyComponent } from '../../properties/components/property.component';
import { ComparePropertiesDialogComponent } from '../../properties/dialogs/compare-properties-dialog/compare-properties-dialog.component';
import { NewPropertyDialogComponent } from '../../properties/dialogs/new-property-dialog/new-property-dialog.component';
import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { PropertiesService } from '../../properties/properties.service';
import { ActivatedRoute } from '@angular/router';
import { FiltersComponent } from '../../shared/components/filters/filters.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { FiltersService } from '../../shared/services/filters.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { CustomSnackbarService } from '../../shared/services/snackbar.service';
import { AuthService } from './../../auth/services/auth.service';
// Cambiado para usar el servicio de favorites central
import { FavoriteService } from '../../favorites/services/favorite-service';
import { FavoriteResponse } from '../../favorites/interfaces/favorite-interface';


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
    PropertyComponent,
    MatTooltipModule,
    FiltersComponent,
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _authService = inject(AuthService);
  private _snackbarService = inject(CustomSnackbarService);
  private _entityDialogService = inject(EntityDialogService);
  private _propertiesService = inject(PropertiesService);
  private _buildingsService = inject(BuildingsService);
  private _filtersService = inject(FiltersService);
  private _sidebarService = inject(SidebarService);
  private route = inject(ActivatedRoute);


  private openBuildingDetailsFromFavorite(buildingId: string) {
    // Busca el marcador correspondiente y abre el panel
    // Si los marcadores aún no están cargados, espera un poco
    const tryOpen = () => {
      const marker = this.markers().find(m => m.id === buildingId && m.type === 'building');
      if (marker) {
        this.onBuildingMarkerClick(marker);
      } else {
        // Intenta de nuevo después de un pequeño delay (por si los marcadores aún no están)
        setTimeout(tryOpen, 300);
      }
    };
    tryOpen();
  }
  private mapConfig: Signal<MapConfig> = computed(() => ({
    center: this.center(),
    zoom: 14.5,
    enableClick: true,
    enableControls: false,
    markers: this.markers(),
  }));

  center = signal<MapCoordinate>(DEFAULT_CENTER);
  markers = signal<MapMarker[]>([]);
  buildingMarkerQueried = signal<MapMarker | null>(null);
  buildingDetails = signal<BuildingDetails | null>(null);
  propertyMarkerQueried = signal<MapMarker | null>(null);
  propertyDetails = signal<PropertyDetails | null>(null);
  buildingProperties = signal<PropertyDetails[] | null>(null);

  isFavorite = signal(false);
  favoriteId = signal<string | null>(null);

  // Lista local de favoritos de propiedades (objetos FavoriteResponse)
  propertyFavoritesList = signal<FavoriteResponse[]>([]);

  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);
  showFilters = signal(true);

  isOwner = computed(() => this._authService.user()?.role === Role.OWNER);
  coordinateToGo = computed(() => this._filtersService.coordinateToGo());
  isAuthenticated = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED
  );
  sidebarOpened = computed(() => this._sidebarService.isOpen());

  constructor() {
  // Detecta si hay un query param 'building' y abre el detalle automáticamente
  this.route.queryParams.subscribe(params => {
    const buildingId = params['building'];
    if (buildingId) {
      this.openBuildingDetailsFromFavorite(buildingId);
    }
  });

  // Efectos reactivos de los filtros
  effect(() => {
    if (
      this._filtersService.filterNearMyLocation() ||
      this._filtersService.filterNearPoint() ||
      this._filtersService.filterNearPointOfInterest()
    ) {
      const buildings = this._filtersService.filteredBuildings().map((b) => ({
        id: b.buildingId,
        coordinate: { latitude: b.latitude, longitude: b.longitude },
        icon: { url: '/building.png' },
        type: 'building',
      }));

      const properties = this._filtersService.filteredProperties().map((p) => ({
        id: p.propertyId,
        coordinate: { latitude: p.latitude, longitude: p.longitude },
        icon: { url: '/property.png' },
        type: 'property',
      }));

      this.markers.set([...buildings, ...properties]);
    }
  });

  effect(() => {
    if (
      !this._filtersService.filterNearMyLocation() &&
      !this._filtersService.filterNearPoint() &&
      !this._filtersService.filterNearPointOfInterest()
    ) {
      this.resetMapMarkers();
    }
  });

  // Cargar favoritos de propiedades cuando el usuario esté presente
  effect(() => {
    const userId = this._authService.user()?.userId;
    if (userId) {
      this.loadPropertyFavorites(userId);
    } else {
      this.propertyFavoritesList.set([]);
    }
  });
}

  resetMapMarkers() {
    this._buildingsService.getBuildings().subscribe((buildings) => {
      const buildingMarkers = buildings.map((b) => ({
        id: b.buildingId,
        coordinate: { latitude: b.latitude, longitude: b.longitude },
        icon: { url: '/building.png' },
        type: 'building',
      }));
      this._propertiesService.getProperties().subscribe((properties) => {
        const propertyMarkers = properties.map((p) => ({
          id: p.propertyId,
          coordinate: { latitude: p.latitude, longitude: p.longitude },
          icon: { url: '/property.png' },
          type: 'property',
        }));
        this.markers.set([...buildingMarkers, ...propertyMarkers]);
      });
    });
  }

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
    if (buildingDetails) {
      this.checkIfFavorite();
    }
  }

  onPropertyDetailsChange(propertyDetails: PropertyDetails | null): void {
    this.propertyDetails.set(propertyDetails);
  }

  onBuildingPropertiesChange(properties: PropertyDetails[] | null): void {
    this.buildingProperties.set(properties);
  }

  onMapClick({ coordinate }: MapClickEvent): void {
    if (this.buildingDetails() !== null || this.propertyDetails() !== null) {
      this.buildingMarkerQueried.set(null);
      this.buildingDetails.set(null);
      this.propertyMarkerQueried.set(null);
      this.propertyDetails.set(null);
    }
  }

  onCenterChanged(coordinate: MapCoordinate): void {
    this._filtersService.setMyLocation(coordinate);
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
    this._router.navigate(['/properties', propertyId]);
  }

  comparativeList = signal<PropertyDetails[]>([]);

  addToComparativeList(property: PropertyDetails) {
    if (!property) return;
    if (
      this.comparativeList().find((p) => p.propertyId === property.propertyId)
    ) {
      this._snackbarService.error(
        'La Vivienda ya está agregada a la Comparación',
        1500
      );
      return;
    }
    this.comparativeList.set([...this.comparativeList(), property]);
    this._snackbarService.success('Vivienda Agregada a la Comparación', 1500);
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
    this._dialog.open(ComparePropertiesDialogComponent, {
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

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  goToMyLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        this.center.set({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => this.center.set(DEFAULT_CENTER),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  // Llama esto cada vez que cambie el buildingDetails
  checkIfFavorite() {
    const userId = this.authService.user()?.userId;
    const buildingId = this.buildingDetails()?.buildingId;
    if (!userId || !buildingId) return;
    this.favoriteService.getFavoritesByUserAndBuilding(userId).subscribe(favs => {
      const fav = favs.find(f => f.buildingID === buildingId);
      this.isFavorite.set(!!fav);
      this.favoriteId.set(fav ? fav.favoriteID : null);
    });
  }

  toggleFavorite() {
    const userId = this.authService.user()?.userId;
    const buildingId = this.buildingDetails()?.buildingId;
    if (!userId || !buildingId) return;
    if (this.isFavorite() && this.favoriteId()) {
      this.favoriteService.removeFavorite(this.favoriteId()!).subscribe(() => {
        this.isFavorite.set(false);
        this.favoriteId.set(null);
      });
    } else {
      this.favoriteService.addFavorite({ userID: userId, buildingID: buildingId }).subscribe(res => {
        this.isFavorite.set(true);
        this.favoriteId.set(res.favoriteID);
      });
    }
  }

  // Devuelve true si la propiedad está en la lista de favoritos del usuario
  isPropertyFavorite(propertyId: string | undefined | null): boolean {
    if (!propertyId) return false;
    return !!this.propertyFavoritesList().find(f => f.propertyID === propertyId);
  }

  // Carga favoritos de propiedades del usuario y los guarda localmente
  loadPropertyFavorites(userId: string) {
    this.favoriteService.getFavoritesByUserAndProperty(userId).subscribe({
      next: (favs) => {
        this.propertyFavoritesList.set(favs || []);
      },
      error: () => {
        this.propertyFavoritesList.set([]);
      }
    });
  }

  // Alterna favorito de una propiedad: si existe lo borra, si no lo crea
  togglePropertyFavorite(propertyId: string | undefined | null) {
    if (!propertyId) return;
    const userId = this.authService.user()?.userId;
    if (!userId) return;

    const existing = this.propertyFavoritesList().find(f => f.propertyID === propertyId);
    if (existing) {
      // borrar optimista: quitar inmediatamente de la lista
      const removedId = existing.favoriteID;
      const prevList = this.propertyFavoritesList();
      this.propertyFavoritesList.set(prevList.filter(f => f.favoriteID !== removedId));

      this.favoriteService.removeFavorite(removedId).subscribe({
        next: () => {
          // eliminado correctamente del servidor, nada más a hacer
        },
        error: () => {
          // revertir en caso de error
          this.propertyFavoritesList.set([...this.propertyFavoritesList(), existing]);
          this._snackbarService.error('No se pudo quitar de favoritos', 2000);
        }
      });
    } else {
      // crear optimista: agregar un favorito temporal para mostrar el corazón
      const tempId = 'temp-' + Date.now();
      const tempFav: FavoriteResponse = {
        favoriteID: tempId,
        userID: userId,
        propertyID: propertyId
      };
      this.propertyFavoritesList.set([...this.propertyFavoritesList(), tempFav]);

      this.favoriteService.addFavorite({ userID: userId, propertyID: propertyId }).subscribe({
        next: (res) => {
          // reemplazar el temporal por la respuesta real (con favoriteID del servidor)
          const updated = this.propertyFavoritesList().map(f => f.favoriteID === tempId ? res : f);
          this.propertyFavoritesList.set(updated);
        },
        error: () => {
          // quitar el temporal y notificar
          this.propertyFavoritesList.set(this.propertyFavoritesList().filter(f => f.favoriteID !== tempId));
          this._snackbarService.error('No se pudo agregar a favoritos', 2000);
        }
      });
    }
  }
}
  // Llama esto cada vez que cambie el buildingDetails
