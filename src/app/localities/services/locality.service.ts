import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalityRequest, LocalityResponse } from '../interfaces/locality.interface';

@Injectable({ providedIn: 'root' })
export class LocalityService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/localities`;

  getLocalities(): Observable<LocalityResponse[]> {
    return this.http.get<LocalityResponse[]>(`${this.baseUrl}`);
  }

  createLocality(locality: LocalityRequest): Observable<LocalityResponse> {
    return this.http.post<LocalityResponse>(this.baseUrl, locality);
  }

  updateLocality(id: string, locality: LocalityRequest): Observable<LocalityResponse> {
    return this.http.put<LocalityResponse>(`${this.baseUrl}/${id}`, locality);
  }

  deleteLocality(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  restoreLocality(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/recover`, {});
  }

  getLocalitiesByProvince(provinceId: string): Observable<LocalityResponse[]> {
    return this.http.get<LocalityResponse[]>(`${this.baseUrl}/by-province/${provinceId}`);
  }
}
