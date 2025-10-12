import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';
import { of } from 'rxjs';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { Role } from '../../auth/enums/role.enum';
import { AuthService } from '../../auth/services/auth.service';
import { BuildingsService } from '../../buildings/buildings.service';
import { Building } from '../../buildings/interfaces/building.interface';
import { LocalityResponse } from '../../localities/interfaces/locality.interface';
import { LocalityService } from '../../localities/services/locality.service';
import { MapCoordinate } from '../../maps/interfaces/map-coordinate.interface';
import { Property } from '../../properties/interfaces/property.interface';
import { PropertiesService } from '../../properties/properties.service';
import { ProvinceResponse } from '../../provinces/interfaces/province.interface';
import { ProvinceService } from '../../provinces/services/province.service';
import { NavElement } from '../interfaces/nav-element.interface';
import { OWNER_NAVBAR_ITEMS } from '../utilities/owner.config';
import { TENANT_NAVBAR_ITEMS } from '../utilities/tenant.config';
import { UNLOGGED_NAVBAR_ITEMS } from '../utilities/unlogged.config';
import { DialogStateService } from './dialog-state.service';

const NAVBAR_ITEMS: Record<string, NavElement[]> = {
  unlogged: UNLOGGED_NAVBAR_ITEMS,
  tenant_logged: TENANT_NAVBAR_ITEMS,
  owner_logged: OWNER_NAVBAR_ITEMS,
};

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private _authService = inject(AuthService);
  private _provinceService = inject(ProvinceService);
  private _localityService = inject(LocalityService);
  private _buildingsService = inject(BuildingsService);
  private _propertiesService = inject(PropertiesService);
  private _dialogStateService = inject(DialogStateService);
  private _filtersOpen = signal(false);

  config = computed((): NavElement[] => {
    const status = this._authService.status();
    const user = this._authService.user();
    return NAVBAR_ITEMS[
      status === AuthStatus.AUTHENTICATED
        ? user?.role === Role.OWNER
          ? 'owner_logged'
          : 'tenant_logged'
        : 'unlogged'
    ];
  });

  disabled = computed(() => this._dialogStateService.isDialogOpen());
  userLogged = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED
  );
  username = computed(() => this._authService.user()?.username);

  handleLogout() {
    this._authService.logout();
  }

  showFilters = computed(
    () =>
      this._authService.status() === AuthStatus.AUTHENTICATED &&
      this._filtersOpen()
  );

  filtersOpen = computed(() => this._filtersOpen());

  toggleFilters(): void {
    this._filtersOpen.set(!this._filtersOpen());
  }

  openFilters(): void {
    this._filtersOpen.set(true);
  }

  closeFilters(): void {
    this._filtersOpen.set(false);
  }

  private _coordinate = signal<MapCoordinate>({ latitude: 0, longitude: 0 });
  public readonly coordinateToGo = computed<MapCoordinate | null>(() => {
    const locality = this.filterLocality();
    return locality
      ? { latitude: locality.latitude, longitude: locality.longitude }
      : null;
  });
  provincesResource = rxResource({
    loader: () => {
      return this._provinceService.getProvinces();
    },
  });
  localitiesResource = rxResource({
    request: computed(() =>
      this.provinces().find((province) => province === this.filterProvince())
    ),
    loader: (request) => {
      if (!request.request) {
        return of(null);
      }
      return this._localityService.getLocalitiesByProvince(
        this.provinces().find((province) => province === request.request)?.id!
      );
    },
  });
  buildingsResource = rxResource({
    request: computed(() => ({
      latitude: this._coordinate().latitude,
      longitude: this._coordinate().longitude,
      radiusKm: this.radius(),
    })),
    loader: (request) => {
      if (
        this.filterNearMyLocation() === false &&
        this.filterNearPoint() === false &&
        this.filterNearPointOfInterest() === false
      ) {
        return of([]);
      }
      return this._buildingsService.getBuildingsNear(
        request.request.latitude,
        request.request.longitude,
        request.request.radiusKm
      );
    },
  });
  propertiesResource = rxResource({
    request: computed(() => ({
      latitude: this._coordinate().latitude,
      longitude: this._coordinate().longitude,
      radiusKm: this.radius(),
    })),
    loader: (request) => {
      if (
        this.filterNearMyLocation() === false &&
        this.filterNearPoint() === false &&
        this.filterNearPointOfInterest() === false
      ) {
        return of([]);
      }
      return this._propertiesService.getPropertiesNear(
        request.request.latitude,
        request.request.longitude,
        request.request.radiusKm
      );
    },
  });

  buildingsNearPoiResource = rxResource({
    request: computed(() => {
      if (
        this.filterNearPointOfInterest() &&
        this.viewport() &&
        this.selectedPointOfInterest()
      ) {
        return {
          poiType: this.selectedPointOfInterest(),
          radiusKm: this.radius(),
          ...this.viewport(),
          limit: 100,
        };
      }
      return null;
    }),
    loader: (request: any) => {
      if (
        this.filterNearMyLocation() === false &&
        this.filterNearPoint() === false &&
        this.filterNearPointOfInterest() === false
      ) {
        return of([]);
      }
      if (!request.request || typeof request.request.poiType !== 'string') {
        return of([]);
      }
      return this._buildingsService.getBuildingsNearPoi(
        request.request.poiType,
        request.request.radiusKm,
        {
          north: request.request.north ?? 0,
          south: request.request.south ?? 0,
          east: request.request.east ?? 0,
          west: request.request.west ?? 0,
        },
        request.request.limit
      );
    },
  });

  propertiesNearPoiResource = rxResource({
    request: computed(() => {
      if (
        this.filterNearPointOfInterest() &&
        this.viewport() &&
        this.selectedPointOfInterest()
      ) {
        return {
          poiType: this.selectedPointOfInterest(),
          radiusKm: this.radius(),
          ...this.viewport(),
          limit: 100,
        };
      }
      return null;
    }),
    loader: (request) => {
      if (
        this.filterNearMyLocation() === false &&
        this.filterNearPoint() === false &&
        this.filterNearPointOfInterest() === false
      ) {
        return of([]);
      }
      if (!request.request || typeof request.request.poiType !== 'string') {
        return of([]);
      }
      return this._propertiesService.getPropertiesNearPoi(
        request.request.poiType,
        request.request.radiusKm,
        {
          north: request.request.north ?? 0,
          south: request.request.south ?? 0,
          east: request.request.east ?? 0,
          west: request.request.west ?? 0,
        },
        request.request.limit
      );
    },
  });

  provinces = signal<ProvinceResponse[]>([]);
  localities = signal<LocalityResponse[]>([]);
  filteredBuildings = signal<Building[]>([]);
  filteredProperties = signal<Property[]>([]);

  viewport = signal<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  setViewportFromMap(map: Map) {
    const view = map.getView();
    const size = map.getSize();
    if (!size) throw new Error('Map size is not available');
    const extent3857 = view.calculateExtent(size);
    const [minX, minY, maxX, maxY] = transformExtent(
      extent3857,
      'EPSG:3857',
      'EPSG:4326'
    );
    this.viewport.set({
      west: minX,
      south: minY,
      east: maxX,
      north: maxY,
    });
  }

  constructor() {
    effect(() => {
      const provincesData = this.provincesResource.value();
      if (provincesData) {
        this.provinces.set(provincesData);
      }
    });

    effect(() => {
      const localitiesData = this.localitiesResource.value();
      if (localitiesData) {
        console.log(localitiesData);
        this.localities.set(localitiesData);
      }
    });

    effect(() => {
      const buildingsData = this.buildingsResource.value();
      if (buildingsData) {
        this.filteredBuildings.set(buildingsData);
      }
    });

    effect(() => {
      const propertiesData = this.propertiesResource.value();
      if (propertiesData) {
        this.filteredProperties.set(propertiesData);
      }
    });

    effect(() => {
      const buildingsData = this.buildingsNearPoiResource.value();
      if (buildingsData) {
        this.filteredBuildings.set(buildingsData);
      }
    });

    effect(() => {
      const propertiesData = this.propertiesNearPoiResource.value();
      if (propertiesData) {
        this.filteredProperties.set(propertiesData);
      }
    });
  }

  filterNearMyLocation = signal<boolean>(false);

  onSelectMyLocation() {
    if (this.filterNearMyLocation() === false) {
      this.filterNearMyLocation.set(true);
      this.filterNearPoint.set(false);
      this.filterNearPointOfInterest.set(false);
    } else {
      this.filterNearMyLocation.set(false);
    }
  }

  setMyLocation(coordinate: MapCoordinate) {
    if (this.filterNearMyLocation() === true) {
      this._coordinate.set(coordinate);
    }
  }

  filterNearPoint = signal<boolean>(false);

  isLocationPointSelected = computed(() => {
    return (
      this._coordinate().latitude !== 0 &&
      this._coordinate().longitude !== 0 &&
      this.filterNearPoint() === true
    );
  });

  onSelectPoint() {
    if (this.filterNearPoint() === false) {
      this.filterNearPoint.set(true);
      this.filterNearMyLocation.set(false);
      this.filterNearPointOfInterest.set(false);
    } else {
      this.filterNearPoint.set(false);
    }
  }
  setSelectedLocationPoint(coordinate: MapCoordinate) {
    if (this.filterNearPoint() === true) {
      this._coordinate.set(coordinate);
    }
  }

  filterNearPointOfInterest = signal<boolean>(false);
  selectedPointOfInterest = signal<string | null>(null);
  onSelectPointOfInterestButton() {
    if (this.filterNearPointOfInterest() === false) {
      this.filterNearPointOfInterest.set(true);
      this.filterNearMyLocation.set(false);
      this.filterNearPoint.set(false);
    } else {
      this.filterNearPointOfInterest.set(false);
    }
  }

  onSelectPointOfInterest(event: string) {
    this.selectedPointOfInterest.set(event);
  }

  radius = signal<number>(10);

  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (value !== null && value !== undefined && value !== '') {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        this.radius.set(numericValue);
      }
    }
  }

  filterProvince = signal<ProvinceResponse | null>(null);
  filterLocality = signal<LocalityResponse | null>(null);

  onSelectProvince(event: ProvinceResponse) {
    this.filterProvince.set(event);
    this.filterLocality.set(null);
  }

  onSelectLocality(event: LocalityResponse) {
    this.filterLocality.set(event);
  }

  filterPriceMin = signal<number | null>(null);
  filterPriceMax = signal<number | null>(null);

  onSelectPriceMin(event: number) {
    this.filterPriceMin.set(event);
  }

  onSelectPriceMax(event: number) {
    this.filterPriceMax.set(event);
  }

  filterPropertyType = signal<boolean>(false);
  filterDepartmentType = signal<boolean>(false);

  onSelectPropertyType() {
    const current = this.filterPropertyType();
    if (current) {
      this.filterPropertyType.set(false);
    } else {
      this.filterPropertyType.set(true);
      this.filterDepartmentType.set(false);
    }
  }

  onSelectDepartmentType() {
    const current = this.filterDepartmentType();
    if (current) {
      this.filterDepartmentType.set(false);
    } else {
      this.filterDepartmentType.set(true);
      this.filterPropertyType.set(false);
    }
  }
  filterAllowPets = signal<boolean>(false);
  filterRooms = signal<number | null>(null);
  filterBathrooms = signal<number | null>(null);
  filterAreaMin = signal<number | null>(null);
  filterAreaMax = signal<number | null>(null);

  onSelectAllowPets(event: boolean) {
    this.filterAllowPets.set(event);
  }

  onSelectRooms(event: number) {
    this.filterRooms.set(event);
  }

  onSelectBathrooms(event: number) {
    this.filterBathrooms.set(event);
  }

  onSelectAreaMin(event: number) {
    this.filterAreaMin.set(event);
  }

  onSelectAreaMax(event: number) {
    this.filterAreaMax.set(event);
  }

  buildingsService = inject(BuildingsService);
  propertiesService = inject(PropertiesService);

  clearFilters() {
    this.filterNearMyLocation.set(false);
    this.filterNearPoint.set(false);
    this.filterNearPointOfInterest.set(false);
    this.selectedPointOfInterest.set(null);
    this.radius.set(10);

    this.filterProvince.set(null);
    this.filterLocality.set(null);

    this.filterPriceMin.set(null);
    this.filterPriceMax.set(null);

    this.filterPropertyType.set(false);
    this.filterDepartmentType.set(false);
    this.filterAllowPets.set(false);
    this.filterRooms.set(null);
    this.filterBathrooms.set(null);
    this.filterAreaMin.set(null);
    this.filterAreaMax.set(null);

    this._coordinate.set({ latitude: 0, longitude: 0 });
    this.viewport.set(null);
  }

  buildingDetailsOpened = signal<boolean>(false);
  propertyDetailsOpened = signal<boolean>(false);
}
