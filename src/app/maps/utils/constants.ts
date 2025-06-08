import { MapCoordinate } from '../interfaces/coordinate.interface';
import { MapConfig } from '../interfaces/map-config.interface';

export const DEFAULT_CENTER: MapCoordinate = {
  latitude: -32.4075,
  longitude: -63.2406,
};

export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: DEFAULT_CENTER,
  zoom: 14.5,
  enableClick: true,
  enableControls: false,
};
