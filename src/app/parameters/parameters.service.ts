import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParametersService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/parameters`;

  maxPrice(): Observable<number> {
    return this._http.get<number>(`${this._baseUrl}/max-price`);
  }

  minPrice(): Observable<number> {
    return this._http.get<number>(`${this._baseUrl}/min-price`);
  }

  rooms(): Observable<number[]> {
    return this._http.get<number[]>(`${this._baseUrl}/rooms`);
  }

  bathrooms(): Observable<number[]> {
    return this._http.get<number[]>(`${this._baseUrl}/bathrooms`);
  }
}
