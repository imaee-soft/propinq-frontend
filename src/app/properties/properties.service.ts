import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreatePropertyRequest } from './interfaces/create-property-request.interface';
import { PropertyDetails } from './interfaces/property-details.interface';
import { Property } from './interfaces/property.interface';
import { PropertyFilterRequest } from './interfaces/property-filter.request';
import { buildFilterHttpParams } from '../shared/utilities/http-params.builder';
import { UpdatePropertyRequest } from './interfaces/update-property-request.interface';
import { PropertyDetailsPage } from './interfaces/property-details-page.interface';

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/properties`;

  getProperties(filter?: PropertyFilterRequest): Observable<Property[]> {
    const params = buildFilterHttpParams(filter);
    return this._http.get<Property[]>(`${this._baseUrl}`, { params });
  }

  getPropertyDetails(
    propertyQueried: string | null
  ): Observable<PropertyDetails> {
    if (propertyQueried == null) {
      return throwError(() => new Error('Invalid propertyQueried: null'));
    }

    return this._http.get<PropertyDetails>(
      `${environment.apiUrl}/api/v1/properties/${propertyQueried}`
    );
  }

  getPropertiesDetails(
      page = 0,
      pageSize = 15
    ): Observable<PropertyDetailsPage> {
      return this._http
        .get<PropertyDetailsPage>(
          `${environment.apiUrl}/api/v1/properties/details`,
          {
            params: { page, size: pageSize },
          }
        )
        .pipe(
          map((response) => {
            const content = response.content.map((property: any) => ({
              ...property,
              propertyId: property.propertyId,
            }));
            return { ...response, content: content };
          })
        );
    }

  createProperty(propertyRequest: CreatePropertyRequest): Observable<any> {
    const formData = new FormData();
    const { images, ...propertyData } = propertyRequest;

    formData.append(
      'property',
      new Blob([JSON.stringify(propertyData)], {
        type: 'application/json',
      })
    );

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image, image.name);
      });
    }

    return this._http.post(this._baseUrl, formData, {
      observe: 'response',
    });
  }

  getPropertiesNear(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Observable<Property[]> {
    return this._http.get<Property[]>(
      `${environment.apiUrl}/api/v1/properties/nearby`,
      {
        params: {
          latitude: latitude,
          longitude: longitude,
          radiusKm: radiusKm,
        },
      }
    );
  }

  getPropertiesNearPoi(
    poiType: string,
    radiusKm: number,
    viewport: { north: number; south: number; east: number; west: number },
    limit?: number
  ) {
    let params = new HttpParams()
      .set('poiType', poiType)
      .set('radiusKm', radiusKm)
      .set('north', viewport.north)
      .set('south', viewport.south)
      .set('east', viewport.east)
      .set('west', viewport.west);

    if (limit != null) params = params.set('limit', limit);

    return this._http.get<Property[]>(
      `${environment.apiUrl}/api/v1/properties/nearby/poi`,
      { params }
    );
  }

  deleteProperty(propertyId: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${propertyId}`);
  }

  restoreProperty(propertyId: string): Observable<PropertyDetails> {
    return this._http.patch<PropertyDetails>(
     `${this._baseUrl}/${propertyId}/restore`,
      {}
    );
  }

}
