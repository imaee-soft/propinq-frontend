import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { PoiViewportResult } from "../interfaces/poi-viewport-result.interface";
import { PoiWithinQuery } from "../interfaces/poi-within-request";
import { PoiType } from "../interfaces/poi-type.interface";
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';

@Injectable({ providedIn: 'root' })
export class PoiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/pois`;

  getPoisWithin(query: PoiWithinQuery) {
    let params = new HttpParams()
      .set('north', String(query.north))
      .set('south', String(query.south))
      .set('east', String(query.east))
      .set('west', String(query.west));

    if (query.limit != null) params = params.set('limit', String(query.limit));
    if (query.zoom != null) params = params.set('zoom', String(Math.floor(query.zoom)));
    if (query.types?.length) {
      params = params.set('types', query.types.join(','));
    }

    return this._http.get<PoiViewportResult>(`${this._baseUrl}/within`, { params });
  }

  getPoisForMap(map: Map, options?: { limit?: number; types?: PoiType[] }) {
    const view = map.getView();
    const size = map.getSize();
    if (!size) throw new Error('Map size is not available');

    const extent3857 = view.calculateExtent(size);
    const [minX, minY, maxX, maxY] = transformExtent(extent3857, 'EPSG:3857', 'EPSG:4326');
    const zoom = view.getZoom();

    const query: PoiWithinQuery = {
      west: minX,
      south: minY,
      east: maxX,
      north: maxY,
      limit: options?.limit,
      types: options?.types,
      zoom: zoom ?? null,
    };

    return this.getPoisWithin(query);
  }
}
