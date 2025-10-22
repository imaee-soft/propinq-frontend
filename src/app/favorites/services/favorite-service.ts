import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteResponse } from '../interfaces/favorite-interface';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
	private apiUrl = `${environment.apiUrl}/api/v1/favorites`;

	constructor(private http: HttpClient) {}

	getFavoritesByUserAndBuilding(userId: string): Observable<FavoriteResponse[]> {
		return this.http.get<FavoriteResponse[]>(`${this.apiUrl}/user/${userId}/building`);
	}

	getFavoritesByUserAndProperty(userId: string): Observable<FavoriteResponse[]> {
		return this.http.get<FavoriteResponse[]>(`${this.apiUrl}/user/${userId}/property`);
	}

	// Nuevo: crear favorito (building o property según payload)
	addFavorite(payload: { userID: string; propertyID?: string; buildingID?: string }): Observable<FavoriteResponse> {
		return this.http.post<FavoriteResponse>(this.apiUrl, payload);
	}

	// Nuevo: eliminar favorito por favoriteID
	removeFavorite(favoriteId: string): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
	}
}
