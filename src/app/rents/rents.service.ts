import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LargePage } from '../shared/interfaces/page.interface';
import { CancelRentRequest } from './interfaces/cancel-rent.interface';
import { RentDocumentRequest } from './interfaces/create-document.interface';
import { CreateRentRequest } from './interfaces/create-rent.interface';
import { RentDetail } from './interfaces/rent-detail.interface';
import { CreateRentResponse } from './interfaces/rent-id.interface';
import { RentProjection } from './interfaces/rent-projection.interface';
import { SimpleRent } from './interfaces/simple-rent.interface';

const projections = [
  {
    date: new Date('2026-02-06'),
    value: 7122.24,
    estimated: false,
    dif: 0,
    amount: 400000,
  },
  {
    date: new Date('2026-05-06'),
    value: 7694.01,
    estimated: false,
    dif: 11.775652871238805,
    amount: 434130.78344548657,
  },
];

@Injectable({ providedIn: 'root' })
export class RentService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/rents`;

  saveRent(
    rentRequest: CreateRentRequest,
    contract: File,
  ): Observable<CreateRentResponse> {
    const formData = new FormData();

    formData.append(
      'rent',
      new Blob([JSON.stringify(rentRequest)], {
        type: 'application/json',
      }),
    );

    formData.append('contract', contract, contract.name);
    return this._http.post<CreateRentResponse>(this._baseUrl, formData);
  }

  getOwnerRents(
    page = 0,
    size = 6,
    surname?: string,
    status: 'all' | 'active' | 'cancelled' | 'done' = 'all',
  ): Observable<LargePage<SimpleRent>> {
    return this._http.get<LargePage<SimpleRent>>(`${this._baseUrl}/owner`, {
      params:
        surname && surname !== ''
          ? { page, size, surname, status }
          : { page, size, status },
    });
  }

  getTenantRents(page = 0, size = 6): Observable<LargePage<SimpleRent>> {
    return this._http.get<LargePage<SimpleRent>>(`${this._baseUrl}/tenant`, {
      params: { page, size },
    });
  }

  getRentDetails(rentId: string) {
    return this._http.get<RentDetail>(`${this._baseUrl}/${rentId}`);
  }

  getRentProjection(rentId: string) {
    return this._http.get<RentProjection[]>(
      `${this._baseUrl}/${rentId}/projection`,
    );
  }

  saveDocument(request: RentDocumentRequest, content: File) {
    const formData = new FormData();

    formData.append(
      'document',
      new Blob([JSON.stringify(request)], {
        type: 'application/json',
      }),
    );

    formData.append('content', content, content.name);
    return this._http.post<CreateRentResponse>(
      `${this._baseUrl}/document`,
      formData,
    );
  }

  cancelRent(rentId: string, answer: CancelRentRequest) {
    return this._http.post(`${this._baseUrl}/${rentId}/cancel`, answer);
  }

  updateContract(rentId: string, content: File) {
    const formData = new FormData();
    formData.append('contract', content, content.name);
    return this._http.patch(`${this._baseUrl}/${rentId}/contract`, formData);
  }

  deleteDocument(documentId: string) {
    return this._http.delete(`${this._baseUrl}/document/${documentId}`);
  }
}
