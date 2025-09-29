import { inject, Injectable } from "@angular/core";
import { Property } from "./interfaces/property.interface";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { PropertyDetails } from "./interfaces/property-details.interface";

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  private _http = inject(HttpClient);

  getProperties(): Observable<Property[]> {
    return this._http.get<Property[]>(`${environment.apiUrl}/api/v1/properties`);
  }

  getPropertyDetails(propertyQueried: string | null):Observable<PropertyDetails>{
    if(propertyQueried == null){
      return throwError(() => new Error('Invalid propertyQueried: null'));
    }

    return this._http.get<PropertyDetails>(
      `${environment.apiUrl}/api/v1/properties/${propertyQueried}`);
  }

   getPropertiesNear(latitude: number, longitude: number, radiusKm: number): Observable<Property[]> {
    return this._http.get<Property[]>(`${environment.apiUrl}/api/v1/properties/nearby`, {
      params: {
        latitude: latitude,
        longitude: longitude,
        radiusKm: radiusKm
      }
    });
  }

}
