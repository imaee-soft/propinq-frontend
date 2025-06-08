import { MapCoordinate } from './coordinate.interface';
import { MapMarker } from './marker.interface';

export interface MapConfig {
  center?: MapCoordinate;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  enableControls?: boolean;
  enableClick?: boolean;
  markers?: MapMarker[];
}
