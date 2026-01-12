import { HttpParams } from '@angular/common/http';
import { PropertyFilterRequest } from '../../properties/interfaces/property-filter.request';

export interface BuildParamsOptions {
  includeBuildingType?: boolean; // deprecated: do not send buildingType from client; server derives
}

export function buildFilterHttpParams(
  params?: PropertyFilterRequest,
  opts: BuildParamsOptions = {}
): HttpParams {
  let qp = new HttpParams();
  if (!params) return qp;
  const add = (k: string, v: any) => {
    if (v === undefined || v === null || v === '') return;
    qp = qp.set(k, String(v));
  };
  if (params.attributes) {
    const a = params.attributes;
    // Do not send buildingType from client to avoid enum mismatches across backends
    add('attributes.priceMin', a.priceMin);
    add('attributes.priceMax', a.priceMax);
    add('attributes.bedrooms', a.bedrooms);
    add('attributes.bathrooms', a.bathrooms);
    add('attributes.petsAllowed', a.petsAllowed);
    add('attributes.areaMin', a.areaMin);
    add('attributes.areaMax', a.areaMax);
  }
  if (params.location) {
    const l = params.location;
    add('location.latitude', l.latitude);
    add('location.longitude', l.longitude);
    add('location.radiusKm', l.radiusKm);
  }
  if (params.poi) {
    const p = params.poi;
    add('poi.poiType', p.poiType); // optional
    add('poi.radiusKm', p.radiusKm);
    add('poi.north', p.north);
    add('poi.south', p.south);
    // normalize west/east to ensure west < east
    if (p.west != null && p.east != null) {
      const west = Math.min(p.west, p.east);
      const east = Math.max(p.west, p.east);
      add('poi.west', west);
      add('poi.east', east);
    } else {
      add('poi.east', p.east);
      add('poi.west', p.west);
    }
    add('poi.limit', p.limit);
  }
  return qp;
}
