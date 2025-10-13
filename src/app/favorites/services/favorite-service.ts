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
}
