import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PropertyTypeResponse, PropertyTypeRequest } from '../interfaces/property-type.interface';

@Injectable({ providedIn: 'root' })
export class PropertyTypeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/propertyTypes`;

  getPropertyTypes(): Observable<PropertyTypeResponse[]> {
    return this.http.get<PropertyTypeResponse[]>(`${this.baseUrl}/all`);
  }

  createPropertyType(propertyType: PropertyTypeRequest): Observable<PropertyTypeResponse> {
    return this.http.post<PropertyTypeResponse>(this.baseUrl, propertyType);
  }

  updatePropertyType(id: string, propertyType: PropertyTypeRequest): Observable<PropertyTypeResponse> {
    return this.http.put<PropertyTypeResponse>(`${this.baseUrl}/${id}`, propertyType);
  }

  deletePropertyType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  restorePropertyType(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/recover`, {});
  }
}
