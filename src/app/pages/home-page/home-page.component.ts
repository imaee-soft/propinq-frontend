import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
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
import { ActivatedRoute } from '@angular/router';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { Role } from '../../auth/enums/role.enum';
import { BuildingsService } from '../../buildings/buildings.service';
import { BuildingComponent } from '../../buildings/components/building/building.component';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { ComparisionService } from '../../comparision/comparision.service';
import { ComparisionPreviewComponent } from '../../comparision/components/comparision-preview/comparision-preview.component';
import { FavoriteResponse } from '../../favorites/interfaces/favorite-interface';
import { MapComponent } from '../../maps/components/map/map.component';
import { MapClickEvent } from '../../maps/interfaces/click-event.interface';
import { MapConfig } from '../../maps/interfaces/map-config.interface';
import { MapCoordinate } from '../../maps/interfaces/map-coordinate.interface';
import { MapMarker } from '../../maps/interfaces/map-marker.interface';
import { UserLocationService } from '../../maps/services/user-location.service';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { PropertyComponent } from '../../properties/components/property.component';
import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { PropertiesService } from '../../properties/properties.service';
import { FiltersComponent } from '../../shared/components/filters/filters.component';
import { HomeBuildingCardComponent } from '../../shared/components/home-building-card/home-building-card.component';
import { HomePropertyCardComponent } from '../../shared/components/home-property-card/home-property-card.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { FiltersService } from '../../shared/services/filters.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { AuthService } from './../../auth/services/auth.service';

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
    HomePropertyCardComponent,
    HomeBuildingCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private _authService = inject(AuthService);
  private _propertiesService = inject(PropertiesService);
  private _route = inject(ActivatedRoute);
  private _buildingsService = inject(BuildingsService);
  private _filtersService = inject(FiltersService);
  private _sidebarService = inject(SidebarService);
  private _userLocationService = inject(UserLocationService);
  private _comparisionService = inject(ComparisionService);
  private _matDialog = inject(MatDialog);
  private _entityDialogService = inject(EntityDialogService);

  private openBuildingDetailsFromFavorite(buildingId: string) {
    // Busca el marcador correspondiente y abre el panel
    // Si los marcadores aún no están cargados, espera un poco
    const tryOpen = () => {
      const marker = this.markers().find(
        (m) => m.id === buildingId && m.type === 'building',
      );
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

  showFilters = signal(true);

  isOwner = computed(() => this._authService.user()?.role === Role.OWNER);
  coordinateToGo = computed(() => this._filtersService.coordinateToGo());
  isAuthenticated = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED,
  );
  loggedUser = computed(() => this._authService.user());
  sidebarOpened = computed(() => this._sidebarService.isOpen());

  // Public flags for template conditions (centralizadas en FiltersService)
  isFiltersModeActive = computed(() =>
    this._filtersService.isFiltersModeActive(),
  );
  hasNoResults = computed(() => this._filtersService.hasNoResults());
  hasAnyFilterApplied = computed(() =>
    this._filtersService.hasAnyFilterApplied(),
  );

  comparativeList = signal<PropertyDetails[]>([]);
  comparativeDrawerOpen = signal(false);
  comparedProperties = computed(() => this._comparisionService.properties());

  constructor() {
    // Abre detalle de building desde query param ?building=ID
    this._route.queryParams.subscribe((params) => {
      const buildingId = params['building'];
      if (buildingId) {
        this.openBuildingDetailsFromFavorite(buildingId);
      }
    });

    // Un único effect que consume los marcadores actuales del servicio
    effect(() => {
      this.markers.set(this._filtersService.currentMarkers());
    });

    // Si no hay filtros de cercanía activos, recarga marcadores base
    effect(() => {
      if (
        !this._filtersService.filterNearMyLocation() &&
        !this._filtersService.filterNearPoint() &&
        !this._filtersService.filterNearPointOfInterest()
      ) {
        this.resetMapMarkers();
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
    if (this.hasAnyFilterApplied()) return;
    this.markers.set(markers ?? []);
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
  }

  markBuildingAsFavorite(favorite: FavoriteResponse) {
    const building = this.buildingDetails();
    if (!building) return;
    building.favoriteId = favorite.favoriteID;
    this.buildingDetails.set({ ...building });
  }

  unmarkBuildingAsFavorite() {
    const building = this.buildingDetails();
    if (!building) return;
    building.favoriteId = null;
    this.buildingDetails.set({ ...building });
  }

  markPropertyAsFavorite(favorite: FavoriteResponse) {
    const property = this.propertyDetails();
    if (!property) return;
    property.favoriteId = favorite.favoriteID;
    this.propertyDetails.set({ ...property });
  }

  unmarkPropertyAsFavorite() {
    const property = this.propertyDetails();
    if (!property) return;
    property.favoriteId = null;
    this.propertyDetails.set({ ...property });
  }

  addToComparativeList(property: PropertyDetails) {
    this._comparisionService.addToComparativeList(property);
  }

  openComparisionPreview() {
    this.comparativeDrawerOpen.set(true);
    this._entityDialogService
      .openComparisionDialog(ComparisionPreviewComponent, {
        panelClass: 'comparision-preview-dialog',
        entity: 'comparision-preview',
        action: 'preview',
        backdropClass: 'dialog-backdrop',
      })
      .subscribe((changed: boolean) => {
        if (changed === true) {
          this._comparisionService.openComparisonDialog();
        } else {
          this.closeComparativeDrawer();
        }
      });
  }

  closeComparativeDrawer() {
    this.comparativeDrawerOpen.set(false);
  }

  openComparisonDialog() {
    this._comparisionService
      .openComparisonDialog()
      ?.afterClosed()
      .subscribe(() => {
        this.closeComparativeDrawer();
      });
  }

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  goToMyLocation(): void {
    const location = this._userLocationService.getUserLocation();
    this.center.set(location);
  }
}
