import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FavoriteEntityPage,
  FavoriteResponse,
} from '../interfaces/favorite-interface';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/api/v1/favorites`;
  private http = inject(HttpClient);

  getFavoriteBuildings(
    page: number,
    size: number = 6,
  ): Observable<FavoriteEntityPage> {
    return this.http.get<FavoriteEntityPage>(`${this.apiUrl}/buildings`, {
      params: { page, size },
    });
  }

  getFavoriteProperties(
    page: number,
    size: number = 6,
  ): Observable<FavoriteEntityPage> {
    return this.http.get<FavoriteEntityPage>(`${this.apiUrl}/properties`, {
      params: { page, size },
    });
  }

  addFavorite(payload: {
    userID: string;
    propertyID?: string;
    buildingID?: string;
  }): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(this.apiUrl, payload);
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
  }
}
