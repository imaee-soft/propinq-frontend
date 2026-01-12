import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { debounceTime, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { FiltersService } from '../../../shared/services/filters.service';
import { CustomSnackbarService } from '../../../shared/services/snackbar.service';
import { MapClickEvent } from '../../interfaces/click-event.interface';
import { MapConfig } from '../../interfaces/map-config.interface';
import { MapCoordinate } from '../../interfaces/map-coordinate.interface';
import { MapMarker } from '../../interfaces/map-marker.interface';
import { PoiViewportResponse } from '../../interfaces/poi-viewport-response.interface';
import { PoiService } from '../../services/poi.service';
import {
  DEFAULT_CENTER,
  DEFAULT_MAP_CONFIG,
  getIconUrlForPoiType,
  MIN_POI_ZOOM,
  transformFromMap,
} from '../../utils/constants';
import XYZ from 'ol/source/XYZ';
import { UserLocationService } from '../../services/user-location.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  mapElement = viewChild<ElementRef>('mapElement');

  config = input<MapConfig>({});
  width = input<string>('100%');
  height = input<string>('100%');
  coordinateToGo = input<MapCoordinate | null>(null);

  mapReady = output<OlMap>();
  mapClick = output<MapClickEvent>();
  markerClick = output<MapMarker>();
  centerChanged = output<MapCoordinate>();

  private _userLocationService = inject(UserLocationService);
  private _snackbarService = inject(CustomSnackbarService);
  private _filtersService = inject(FiltersService);
  private _mapInstance = signal<OlMap | null>(null);
  private _isMapInitialized = signal<boolean>(false);
  private _mapConfig = computed(() => {
    const location = this._userLocationService.getUserLocation();
    const config = { ...DEFAULT_MAP_CONFIG, ...this.config() };
    return {
      ...DEFAULT_MAP_CONFIG,
      ...config,
      markers: [
        ...(config.markers || []),
        {
          type: 'location',
          coordinate: location,
          icon: { url: '/location.png' },
        },
      ],
    };
  });
  private _markers = computed(() => this._mapConfig().markers || []);
  private _center = computed(() => this._mapConfig().center || DEFAULT_CENTER);

  private _vectorSource = new VectorSource();
  private _vectorLayer = new VectorLayer({
    source: this._vectorSource,
  });

  private _poiSource = new VectorSource();
  private _poiLayer = new VectorLayer({
    source: this._poiSource,
  });
  private _poiStyleCache = new Map<string, Style>();

  private _poiService = inject(PoiService);

  private _viewport$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.initializeMap();
    this.initializeViewportListener();
  }

  ngOnDestroy(): void {
    const map = this._mapInstance()!;
    map.setTarget(undefined);
    this._mapInstance.set(null);
    this._destroy$.next();
    this._destroy$.complete();
  }

  constructor() {
    this._poiLayer.setStyle(this.poiStyleForFeature);

    effect(
      () => this._markers() && this._isMapInitialized() && this.updateMarkers()
    );
    effect(
      () =>
        this._center() &&
        this._isMapInitialized() &&
        this.goToCoordinate(this._center())
    );

    effect(() => {
      const coord = this.coordinateToGo();
      if (coord && this._isMapInitialized()) {
        this.goToCoordinate(coord);
      }
    });
  }

  private initializeMap(): void {
    const map = this.buildMap(this._mapConfig());
    this.initializeMapListeners(map);
    this._mapInstance.set(map);
    this._isMapInitialized.set(true);
    this.mapReady.emit(map);
    // Inicializar viewport inmediatamente para que el modo POI tenga bounds sin requerir mover el mapa
    this._filtersService.setViewportFromMap(map);
    this._viewport$.next();
  }

  private buildMap({
    center,
    zoom,
    minZoom,
    maxZoom,
    enableControls,
  }: MapConfig): OlMap {
    return new OlMap({
      target: this.mapElement()!.nativeElement,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            attributions: '©OpenStreetMap, ©CARTO',
            maxZoom: 20,
          }),
        }),
        this._vectorLayer,
        this._poiLayer,
      ],
      controls: enableControls ? undefined : [],
      view: new View({
        center: fromLonLat([center!.longitude, center!.latitude]),
        zoom,
        minZoom,
        maxZoom,
      }),
    });
  }

  private initializeMapListeners(map: OlMap): void {
    if (!this._mapConfig().enableClick) return;
    map.on('click', (event: any) => {
      const coordinate = event.coordinate;
      const lonLat = transformFromMap(coordinate);

      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature && feature.get('marker')) {
        const marker = feature.get('marker') as MapMarker;
        this.markerClick.emit(marker);
      } else {
        this.mapClick.emit({
          coordinate: lonLat,
        });
      }
    });
    map.on('moveend', () => {
      this._viewport$.next();
      const center = map.getView().getCenter();
      if (center) {
        const lonLat = transformFromMap(center);
        this.centerChanged.emit(lonLat);
      }
      this._filtersService.setViewportFromMap(map);
    });
  }

  private initializeViewportListener(): void {
    this._viewport$
      .pipe(
        debounceTime(250),
        switchMap(() => {
          const map = this._mapInstance();
          if (!map) return EMPTY;
          const zoom = map.getView().getZoom() ?? 0;

          if (zoom < MIN_POI_ZOOM) {
            this._poiSource.clear();
            this._poiSource.changed();
            return EMPTY;
          }

          return this._poiService.getPoisForMap(map, {
            limit: 500,
          });
        }),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (result) => this.renderPoiMarkers(result.items),
        error: () => this._snackbarService.error('Error cargando POIs'),
      });
  }

  private goToCoordinate(coordinate: MapCoordinate): void {
    const map = this._mapInstance()!;
    const view = map.getView();
    const olCoordinate = fromLonLat([
      coordinate.longitude,
      coordinate.latitude,
    ]);

    view.animate({
      center: olCoordinate,
      zoom: 15,
      duration: 1000,
    });
  }

  private updateMarkers(): void {
    this._vectorSource.clear();
    this._markers().forEach((marker) => {
      const markerFeature = this.buildMarkerFeature(marker);
      this._vectorSource.addFeature(markerFeature);
    });
    this._vectorSource.changed();
  }

  private renderPoiMarkers(pois: PoiViewportResponse[]): void {
    this._poiSource.clear();

    for (const poi of pois) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([poi.longitude, poi.latitude])),
        poiId: poi.id,
        poiType: poi.type,
        title: poi.name,
        marker: {
          id: poi.id,
          title: poi.name,
          type: poi.type,
          coordinate: { longitude: poi.longitude, latitude: poi.latitude },
        } as MapMarker,
      });
      this._poiSource.addFeature(feature);
    }

    this._poiSource.changed();
  }

  private buildMarkerFeature({
    id,
    coordinate,
    title,
    icon,
    type,
  }: MapMarker): Feature {
    const feature = new Feature({
      geometry: new Point(
        fromLonLat([coordinate.longitude, coordinate.latitude])
      ),
      id,
      title,
      marker: { id, coordinate, title, type },
    });

    if (icon)
      feature.setStyle(
        new Style({
          image: new Icon({
            src: icon.url,
            scale: 1,
          }),
        })
      );

    return feature;
  }

  private getPoiStyle(type?: string | null): Style {
    const key = String(type ?? 'property');
    const cached = this._poiStyleCache.get(key);
    if (cached) return cached;

    const style = new Style({
      image: new Icon({
        src: getIconUrlForPoiType(type ?? undefined),
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        scale: 1,
      }),
    });

    this._poiStyleCache.set(key, style);
    return style;
  }

  private poiStyleForFeature = (feature: FeatureLike): Style => {
    const marker = feature.get('marker');
    const type: string | null | undefined =
      marker?.type ?? feature.get('poiType');
    return this.getPoiStyle(type ?? null);
  };
}
