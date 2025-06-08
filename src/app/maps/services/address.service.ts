import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MapCoordinate } from '../interfaces/coordinate.interface';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private _http = inject(HttpClient);

  geocodeAddress(address: string) {
    return this._http
      .get<any[]>(`${environment.addressesUrl}/search`, {
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

  private mapCoordinate(response: any): MapCoordinate | null {
    if (response && response.length > 0) {
      return {
        longitude: parseFloat(response[0].lon),
        latitude: parseFloat(response[0].lat),
      };
    }
    return null;
  }
}
