import { Coordinate } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import { MapConfig } from '../interfaces/map-config.interface';
import { MapCoordinate } from '../interfaces/map-coordinate.interface';

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

export const transformFromMap = (coordinate: Coordinate) => {
  const [longitude, latitude] = toLonLat(coordinate);
  return {
    longitude,
    latitude,
  };
};
