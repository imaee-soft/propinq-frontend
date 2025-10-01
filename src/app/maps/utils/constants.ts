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

export const ICON_BY_TYPE: Record<string, string> = {
  AMENITY: '/circle.png',
  SHOP: '/circle.png',
  TOURISM: '/circle.png',
  LEISURE: '/circle.png',
  HISTORIC: '/circle.png',
  MAN_MADE: '/circle.png',
  NATURAL: '/circle.png',
  SPORT: '/circle.png',
  CRAFT: '/circle.png',
  OFFICE: '/circle.png',
  EMERGENCY: '/circle.png',
  HEALTHCARE: '/circle.png',
  PUBLIC_TRANSPORT: '/circle.png',
  RAILWAY: '/circle.png',
  AEROWAY: '/circle.png',
  AERIALWAY: '/circle.png',
  POWER: '/circle.png',
  WATERWAY: '/circle.png',
  HIGHWAY: '/circle.png',
};

export function getIconUrlForPoiType(type?: string | null): string {
  return (type && ICON_BY_TYPE[type]) || '/property.png';
}

export const MIN_POI_ZOOM = 13;
