export interface AttributeFilterRequest {
  buildingType?: string; // ignored by /properties, applicable to /buildings and /buildings/{id}/properties
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  petsAllowed?: boolean;
  areaMin?: number;
  areaMax?: number;
}

export interface LocationFilterRequest {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export type PoiType =
  | 'AMENITY'
  | 'SHOP'
  | 'TOURISM'
  | 'LEISURE'
  | 'HISTORIC'
  | 'MAN_MADE'
  | 'NATURAL'
  | 'SPORT'
  | 'CRAFT'
  | 'OFFICE'
  | 'EMERGENCY'
  | 'HEALTHCARE'
  | 'PUBLIC_TRANSPORT'
  | 'RAILWAY'
  | 'AEROWAY'
  | 'AERIALWAY'
  | 'POWER'
  | 'WATERWAY'
  | 'HIGHWAY';

export interface PoiFilterRequest {
  poiType?: PoiType;
  radiusKm?: number;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  limit?: number;
}

export interface PropertyFilterRequest {
  attributes?: AttributeFilterRequest;
  location?: LocationFilterRequest;
  poi?: PoiFilterRequest;
}
