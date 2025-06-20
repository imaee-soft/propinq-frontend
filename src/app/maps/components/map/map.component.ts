import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { MapClickEvent } from '../../interfaces/click-event.interface';
import { MapConfig } from '../../interfaces/map-config.interface';
import { MapCoordinate } from '../../interfaces/map-coordinate.interface';
import { MapMarker } from '../../interfaces/map-marker.interface';
import {
  DEFAULT_CENTER,
  DEFAULT_MAP_CONFIG,
  transformFromMap,
} from '../../utils/constants';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrl: 'map.component.css',
  standalone: true,
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  mapElement = viewChild<ElementRef>('mapElement');

  config = input<MapConfig>({});
  width = input<string>('100%');
  height = input<string>('100%');

  mapReady = output<Map>();
  mapClick = output<MapClickEvent>();
  markerClick = output<MapMarker>();

  private _mapInstance = signal<Map | null>(null);
  private _isMapInitialized = signal<boolean>(false);
  private _mapConfig = computed(() => {
    return {
      ...DEFAULT_MAP_CONFIG,
      ...this.config(),
    };
  });
  private _markers = computed(() => this._mapConfig().markers || []);
  private _center = computed(() => this._mapConfig().center || DEFAULT_CENTER);

  private _vectorSource = new VectorSource();
  private _vectorLayer = new VectorLayer({
    source: this._vectorSource,
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    const map = this._mapInstance()!;
    map.setTarget(undefined);
    this._mapInstance.set(null);
  }

  constructor() {
    effect(
      () => this._markers() && this._isMapInitialized() && this.updateMarkers()
    );
    effect(
      () =>
        this._center() &&
        this._isMapInitialized() &&
        this.goToCoordinate(this._center())
    );
  }

  private initializeMap(): void {
    const map = this.buildMap(this._mapConfig());
    this.initializeMapListeners(map);
    this._mapInstance.set(map);
    this._isMapInitialized.set(true);
    this.mapReady.emit(map);
  }

  private buildMap({
    center,
    zoom,
    minZoom,
    maxZoom,
    enableControls,
  }: MapConfig): Map {
    return new Map({
      target: this.mapElement()!.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this._vectorLayer,
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

  private initializeMapListeners(map: Map): void {
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

  private buildMarkerFeature({
    id,
    coordinate,
    title,
    icon,
  }: MapMarker): Feature {
    const feature = new Feature({
      geometry: new Point(
        fromLonLat([coordinate.longitude, coordinate.latitude])
      ),
      id,
      title,
      marker: { id, coordinate, title },
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
}
