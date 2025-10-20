import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreatePropertyRequest } from './interfaces/create-property.request';
import { PropertyDetails } from './interfaces/property-details.interface';
import { Property } from './interfaces/property.interface';
import { PropertyFilterRequest } from './interfaces/property-filter.request';
import { buildFilterHttpParams } from '../shared/utilities/http-params.builder';

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

}
