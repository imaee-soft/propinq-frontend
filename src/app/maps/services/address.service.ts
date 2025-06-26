import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Address } from '../adapters/address.adapter';
import { MapCoordinate } from '../interfaces/map-coordinate.interface';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private _http = inject(HttpClient);

  geocodeAddress(address: string): Observable<MapCoordinate | null> {
    return this._http
      .get<Address[]>(`${environment.addressesUrl}/search`, {
        params: {
          format: 'json',
          q: address,
          limit: 1,
        },
      })
      .pipe(
        map(this.mapCoordinate),
        catchError(() => of(null))
      );
  }

  decodeAddress({
    latitude,
    longitude,
  }: MapCoordinate): Observable<string | null> {
    return this._http
      .get<Address>(`${environment.addressesUrl}/reverse`, {
        params: {
          format: 'json',
          lat: latitude,
          lon: longitude,
        },
      })
      .pipe(
        map(this.mapAddress),
        catchError(() => of(null))
      );
  }

  private mapCoordinate(response: Address[]): MapCoordinate | null {
    return response && response.length > 0
      ? {
          longitude: parseFloat(response[0].lon),
          latitude: parseFloat(response[0].lat),
        }
      : null;
  }

  private mapAddress({ address }: Address): string {
    return address
      ? [address.road, address.house_number, address.town, address.state]
          .filter(Boolean)
          .join(', ')
      : '';
  }
}
