import { MapCoordinate } from './map-coordinate.interface';
import { MapMarker } from './map-marker.interface';

export interface MapConfig {
  center?: MapCoordinate;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  enableControls?: boolean;
  enableClick?: boolean;
  markers?: MapMarker[];
}
