import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NeighborhoodRequest, NeighborhoodResponse } from '../interfaces/neighborhood.interface';

@Injectable({ providedIn: 'root' })
export class NeighborhoodService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/neighborhoods`;

  getNeighborhoods(): Observable<NeighborhoodResponse[]> {
    return this.http.get<NeighborhoodResponse[]>(`${this.baseUrl}`);
  }

  createNeighborhood(neighborhood: NeighborhoodRequest): Observable<NeighborhoodResponse> {
    return this.http.post<NeighborhoodResponse>(this.baseUrl, neighborhood);
  }

  updateNeighborhood(id: string, neighborhood: NeighborhoodRequest): Observable<NeighborhoodResponse> {
    return this.http.put<NeighborhoodResponse>(`${this.baseUrl}/${id}`, neighborhood);
  }

  deleteNeighborhood(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  restoreNeighborhood(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/recover`, {});
  }
}
