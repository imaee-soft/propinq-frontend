import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LargePage } from '../shared/interfaces/page.interface';
import { CreateRentRequest } from './interfaces/create-rent.interface';
import { SimpleRent } from './interfaces/simple-rent.interface';

@Injectable({ providedIn: 'root' })
export class RentService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/rents`;

  createProperty(
    rentRequest: CreateRentRequest,
    contract: File,
  ): Observable<any> {
    const formData = new FormData();

    formData.append(
      'rent',
      new Blob([JSON.stringify(rentRequest)], {
        type: 'application/json',
      }),
    );

    formData.append('contract', contract, contract.name);

    return this._http.post(this._baseUrl, formData, {
      observe: 'response',
    });
  }

  getOwnerRents(page = 0, size = 6): Observable<LargePage<SimpleRent>> {
    return this._http.get<LargePage<SimpleRent>>(`${this._baseUrl}/owner`, {
      params: { page, size },
    });
  }
}
