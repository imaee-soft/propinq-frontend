import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../shared/services/notification.service';
import { Address } from '../adapters/address.adapter';
import { MapCoordinate } from '../interfaces/map-coordinate.interface';

const ADDRESS_NOT_FOUND_ERROR =
  'No se encontró la dirección ingresada. Por favor, verificala e intentalo de nuevo.';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private _http = inject(HttpClient);
  private _notificationService = inject(NotificationService);

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
        tap(this.notifyIfAddressNotFound.bind(this)),
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

  private notifyIfAddressNotFound(response: Address[]): void {
    if (response.length === 0)
      this._notificationService.error(ADDRESS_NOT_FOUND_ERROR);
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
