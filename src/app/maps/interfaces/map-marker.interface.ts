import { MapCoordinate } from './map-coordinate.interface';
import { MarkerIcon } from './marker-icon.interface';

export interface MapMarker {
  id: string;
  coordinate: MapCoordinate;
  title?: string;
  icon?: MarkerIcon;
}
