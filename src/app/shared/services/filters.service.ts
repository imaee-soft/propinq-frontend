import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuildingsService } from '../../buildings/buildings.service';
import { Building } from '../../buildings/interfaces/building.interface';
import { LocalityResponse } from '../../localities/interfaces/locality.interface';
import { LocalityService } from '../../localities/services/locality.service';
import { MapCoordinate } from '../../maps/interfaces/map-coordinate.interface';
import { Property } from '../../properties/interfaces/property.interface';
import { PropertiesService } from '../../properties/properties.service';
import { ProvinceResponse } from '../../provinces/interfaces/province.interface';
import { ProvinceService } from '../../provinces/services/province.service';

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private _buildingsService = inject(BuildingsService);
  private _propertiesService = inject(PropertiesService);
  private _provinceService = inject(ProvinceService);
  private _localityService = inject(LocalityService);

  private _coordinate = signal<MapCoordinate>({ latitude: 0, longitude: 0 });
  public readonly coordinateToGo = computed<MapCoordinate | null>(() => {
    const locality = this.filterLocality();
    return locality
      ? { latitude: locality.latitude, longitude: locality.longitude }
      : null;
  });

  filterPriceMin = signal<number | null>(null);
  filterPriceMax = signal<number | null>(null);
  filterPropertyType = signal<boolean>(false);
  filterDepartmentType = signal<boolean>(false);
  filterAllowPets = signal<boolean | null>(null);
  filterRooms = signal<number | null>(null);
  filterBathrooms = signal<number | null>(null);
  provinces = signal<ProvinceResponse[]>([]);
  localities = signal<LocalityResponse[]>([]);
  filteredBuildings = signal<Building[]>([]);
  filteredProperties = signal<Property[]>([]);
  // Resultados base (sin filtros) gestionados por el servicio
  private baseBuildings = signal<Building[]>([]);
  private baseProperties = signal<Property[]>([]);
  // Estado derivado centralizado para consumo desde componentes
  isFiltersModeActive = computed(
    () =>
      this.filterNearMyLocation() ||
      this.filterNearPoint() ||
      this.filterNearPointOfInterest(),
  );
  hasAnyFilterApplied = computed(() => {
    return (
      this.isFiltersModeActive() ||
      this.filterPriceMin() !== null ||
      this.filterPriceMax() !== null ||
      this.filterRooms() !== null ||
      this.filterBathrooms() !== null ||
      this.filterAllowPets() !== null ||
      this.filterPropertyType() === true ||
      this.filterDepartmentType() === true
    );
  });
  hasNoResults = computed(
    () =>
      this.filteredBuildings().length === 0 &&
      this.filteredProperties().length === 0,
  );
  filterProvince = signal<ProvinceResponse | null>(null);
  filterLocality = signal<LocalityResponse | null>(null);
  filterNearMyLocation = signal<boolean>(false);
  filterNearPoint = signal<boolean>(false);
  filterNearPointOfInterest = signal<boolean>(false);
  selectedPointOfInterest = signal<string | null>(null);
  radius = signal<number>(10);

  provincesResource = rxResource({
    loader: () => {
      return this._provinceService.getProvinces();
    },
  });

  localitiesResource = rxResource({
    request: computed(() =>
      this.provinces().find((province) => province === this.filterProvince()),
    ),
    loader: (request) => {
      if (!request.request) {
        return of(null);
      }
      return this._localityService.getLocalitiesByProvince(
        this.provinces().find((province) => province === request.request)?.id!,
      );
    },
  });

  // Unificados: un recurso por entidad que alterna entre ubicación y POI
  buildingsResource = rxResource({
    request: computed(() => {
      const typeSelection: 'buildings' | 'properties' | 'all' =
        this.filterDepartmentType()
          ? 'buildings'
          : this.filterPropertyType()
            ? 'properties'
            : 'all';
      const attrs = {
        priceMin: this.filterPriceMin(),
        priceMax: this.filterPriceMax(),
        bedrooms: this.filterRooms(),
        bathrooms: this.filterBathrooms(),
        petsAllowed: this.filterAllowPets(),
      };
      if (this.filterNearPointOfInterest() && this.viewport()) {
        return {
          mode: 'poi',
          typeSelection,
          attrs,
          radiusKm: this.radius(),
          ...this.viewport(),
          poiType: this.selectedPointOfInterest(),
        } as const;
      }
      if (this.filterNearMyLocation() || this.filterNearPoint()) {
        return {
          mode: 'location',
          typeSelection,
          attrs,
          latitude: this._coordinate().latitude,
          longitude: this._coordinate().longitude,
          radiusKm: this.radius(),
        } as const;
      }
      // attributes-only fallback: permite filtrar sin modo activo
      return { mode: 'attributes', typeSelection, attrs } as const;
    }),
    loader: (request) => {
      const r = request.request as any;
      if (r.typeSelection === 'properties') return of<Building[]>([]);
      if (r.mode === 'idle') return of<Building[]>([]);
      if (r.mode === 'attributes') {
        return this._buildingsService.getBuildings({
          attributes: {
            priceMin: r.attrs.priceMin ?? undefined,
            priceMax: r.attrs.priceMax ?? undefined,
            bedrooms: r.attrs.bedrooms ?? undefined,
            bathrooms: r.attrs.bathrooms ?? undefined,
            petsAllowed: r.attrs.petsAllowed,
          },
        });
      }
      if (r.mode === 'location') {
        return this._buildingsService.getBuildings({
          attributes: {
            priceMin: r.attrs.priceMin ?? undefined,
            priceMax: r.attrs.priceMax ?? undefined,
            bedrooms: r.attrs.bedrooms ?? undefined,
            bathrooms: r.attrs.bathrooms ?? undefined,
            petsAllowed: r.attrs.petsAllowed,
          },
          location: {
            latitude: r.latitude,
            longitude: r.longitude,
            radiusKm: r.radiusKm,
          },
        });
      }
      // mode === 'poi'
      const west = Math.min(r.west ?? 0, r.east ?? 0);
      const east = Math.max(r.west ?? 0, r.east ?? 0);
      return this._buildingsService.getBuildings({
        attributes: {
          priceMin: r.attrs.priceMin ?? undefined,
          priceMax: r.attrs.priceMax ?? undefined,
          bedrooms: r.attrs.bedrooms ?? undefined,
          bathrooms: r.attrs.bathrooms ?? undefined,
          petsAllowed: r.attrs.petsAllowed,
        },
        poi: {
          poiType: r.poiType ?? undefined,
          radiusKm: r.radiusKm,
          north: r.north ?? 0,
          south: r.south ?? 0,
          east,
          west,
          limit: 100,
        },
      });
    },
  });

  propertiesResource = rxResource({
    request: computed(() => {
      const typeSelection: 'buildings' | 'properties' | 'all' =
        this.filterDepartmentType()
          ? 'buildings'
          : this.filterPropertyType()
            ? 'properties'
            : 'all';
      const attrs = {
        priceMin: this.filterPriceMin(),
        priceMax: this.filterPriceMax(),
        bedrooms: this.filterRooms(),
        bathrooms: this.filterBathrooms(),
        petsAllowed: this.filterAllowPets(),
      };
      if (this.filterNearPointOfInterest() && this.viewport()) {
        return {
          mode: 'poi',
          typeSelection,
          attrs,
          radiusKm: this.radius(),
          ...this.viewport(),
          poiType: this.selectedPointOfInterest(),
        } as const;
      }
      if (this.filterNearMyLocation() || this.filterNearPoint()) {
        return {
          mode: 'location',
          typeSelection,
          attrs,
          latitude: this._coordinate().latitude,
          longitude: this._coordinate().longitude,
          radiusKm: this.radius(),
        } as const;
      }
      // attributes-only fallback: permite filtrar sin modo activo
      return { mode: 'attributes', typeSelection, attrs } as const;
    }),
    loader: (request) => {
      const r = request.request as any;
      if (r.typeSelection === 'buildings') return of<Property[]>([]);
      if (r.mode === 'idle') return of<Property[]>([]);
      if (r.mode === 'attributes') {
        return this._propertiesService.getProperties({
          attributes: {
            priceMin: r.attrs.priceMin ?? undefined,
            priceMax: r.attrs.priceMax ?? undefined,
            bedrooms: r.attrs.bedrooms ?? undefined,
            bathrooms: r.attrs.bathrooms ?? undefined,
            petsAllowed: r.attrs.petsAllowed,
          },
        });
      }
      if (r.mode === 'location') {
        return this._propertiesService.getProperties({
          attributes: {
            priceMin: r.attrs.priceMin ?? undefined,
            priceMax: r.attrs.priceMax ?? undefined,
            bedrooms: r.attrs.bedrooms ?? undefined,
            bathrooms: r.attrs.bathrooms ?? undefined,
            petsAllowed: r.attrs.petsAllowed ?? undefined,
            buildingType: r.attrs.buildingType ?? undefined, // ignorado por /properties
          },
          location: {
            latitude: r.latitude,
            longitude: r.longitude,
            radiusKm: r.radiusKm,
          },
        });
      }
      // mode === 'poi'
      const west = Math.min(r.west ?? 0, r.east ?? 0);
      const east = Math.max(r.west ?? 0, r.east ?? 0);
      return this._propertiesService.getProperties({
        attributes: {
          priceMin: r.attrs.priceMin ?? undefined,
          priceMax: r.attrs.priceMax ?? undefined,
          bedrooms: r.attrs.bedrooms ?? undefined,
          bathrooms: r.attrs.bathrooms ?? undefined,
          petsAllowed: r.attrs.petsAllowed,
        },
        poi: {
          poiType: r.poiType ?? undefined,
          radiusKm: r.radiusKm,
          north: r.north ?? 0,
          south: r.south ?? 0,
          east,
          west,
          limit: 100,
        },
      });
    },
  });

  // Carga base de resultados cuando no hay filtros aplicados
  baseResultsResource = rxResource({
    request: computed(() => ({
      active: !this.hasAnyFilterApplied(),
      dept: this.filterDepartmentType(),
      house: this.filterPropertyType(),
    })),
    loader: (request) => {
      const r = request.request as {
        active: boolean;
        dept: boolean;
        house: boolean;
      };
      if (!r || !r.active) {
        return of({
          buildings: [] as Building[],
          properties: [] as Property[],
        });
      }
      if (r.dept && !r.house) {
        return this._buildingsService
          .getBuildings()
          .pipe(
            map((buildings) => ({ buildings, properties: [] as Property[] })),
          );
      }
      if (r.house && !r.dept) {
        return this._propertiesService
          .getProperties()
          .pipe(
            map((properties) => ({ buildings: [] as Building[], properties })),
          );
      }
      return forkJoin({
        buildings: this._buildingsService.getBuildings(),
        properties: this._propertiesService.getProperties(),
      });
    },
  });

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
      'EPSG:4326',
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
      const base = this.baseResultsResource.value();
      if (base) {
        this.baseBuildings.set(base.buildings);
        this.baseProperties.set(base.properties);
      }
    });

    effect(() => {
      const dept = this.filterDepartmentType();
      const house = this.filterPropertyType();
      if (dept && !house) {
        this.filteredProperties.set([]);
      } else if (house && !dept) {
        this.filteredBuildings.set([]);
      }
    });
  }

  currentResults = computed(() => {
    if (this.hasAnyFilterApplied()) {
      return {
        buildings: this.filteredBuildings(),
        properties: this.filteredProperties(),
      };
    }
    return {
      buildings: this.baseBuildings(),
      properties: this.baseProperties(),
    };
  });

  // Marcadores ya tipados para el mapa (con type)
  currentMarkers = computed(() => {
    const b = this.currentResults().buildings.map((x) => ({
      id: x.buildingId,
      coordinate: { latitude: x.latitude, longitude: x.longitude },
      icon: { url: '/building.png' },
      type: 'building' as const,
      title: x.name,
    }));
    const p = this.currentResults().properties.map((x) => ({
      id: x.propertyId,
      coordinate: { latitude: x.latitude, longitude: x.longitude },
      icon: { url: '/property.png' },
      type: 'property' as const,
      title: x.title,
    }));
    return [...b, ...p];
  });

  // Selección explícita de "Todos": limpia ambos toggles
  onSelectAllTypes() {
    this.filterPropertyType.set(false);
    this.filterDepartmentType.set(false);
  }

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

  onSliderChange(event: any) {
    // Soportar tanto MatSliderChange (event.value) como eventos nativos (event.target.value)
    let next: number | null = null;
    if (event && typeof event.value === 'number') {
      next = event.value as number;
    } else if (event && event.target && event.target.value !== undefined) {
      const raw = event.target.value;
      if (raw !== null && raw !== undefined && raw !== '') {
        const n = Number(raw);
        if (!isNaN(n)) next = n;
      }
    }
    if (next !== null) this.radius.set(next);
  }

  onSelectProvince(event: ProvinceResponse) {
    this.filterProvince.set(event);
    this.filterLocality.set(null);
  }

  onSelectLocality(event: LocalityResponse) {
    this.filterLocality.set(event);
  }

  onSelectPriceMin(event: number) {
    this.filterPriceMin.set(event);
  }

  onSelectPriceMax(event: number) {
    this.filterPriceMax.set(event);
  }

  onSelectPropertyType() {
    // Idempotente: seleccionar "Casas" siempre activa casas y desactiva departamentos
    this.filterPropertyType.set(true);
    this.filterDepartmentType.set(false);
  }

  onSelectDepartmentType() {
    // Idempotente: seleccionar "Departamentos" siempre activa departamentos y desactiva casas
    this.filterDepartmentType.set(true);
    this.filterPropertyType.set(false);
  }

  onSelectAllowPets(checked: boolean) {
    // checked=true  -> true (filtrar solo que permitan mascotas)
    // checked=false -> false (filtrar solo que NO permitan mascotas)
    // Si necesitáramos estado indeterminado desde UI, podríamos mapearlo a null
    this.filterAllowPets.set(checked);
  }

  onSelectRooms(event: number) {
    this.filterRooms.set(event);
  }

  onSelectBathrooms(event: number) {
    this.filterBathrooms.set(event);
  }

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
    // Volver a estado indeterminado (sin filtro)
    this.filterAllowPets.set(null);
    this.filterRooms.set(null);
    this.filterBathrooms.set(null);
    this._coordinate.set({ latitude: 0, longitude: 0 });
    this.viewport.set(null);
  }
}
