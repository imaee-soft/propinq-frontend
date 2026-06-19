import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteRequest, FavoriteResponse } from '../interfaces/favorite.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/api/v1/favorites`;

  constructor(private http: HttpClient) {}

  addFavorite(request: FavoriteRequest): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(this.apiUrl, request);
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
  }

  getFavoritesByUserAndBuilding(userId: string): Observable<FavoriteResponse[]> {
    return this.http.get<FavoriteResponse[]>(`${this.apiUrl}/user/${userId}/building`);
  }
}
