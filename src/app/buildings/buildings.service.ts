import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { BuildingRequest } from './adapters/building-request';
import { BuildingDetails } from './interfaces/building-details.interface';
import { Building } from './interfaces/building.interface';

@Injectable({ providedIn: 'root' })
export class BuildingsService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/buildings`;

  createBuilding(buildingRequest: BuildingRequest) {
    const formData = new FormData();
    const { images, ...buildingData } = buildingRequest;

    formData.append(
      'building',
      new Blob([JSON.stringify(buildingData)], {
        type: 'application/json',
      })
    );

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image, image.name);
      });
    }

    return this._http.post(this._baseUrl, formData, {
      observe: 'response',
    });
  }

  getBuildings(): Observable<Building[]> {
    return this._http.get<Building[]>(`${environment.apiUrl}/api/v1/buildings`);
  }

  getBuildingDetails(
    buildingQueried: string | null
  ): Observable<BuildingDetails> {
    if (buildingQueried == null) {
      return throwError(() => new Error('Invalid buildingQueried: null'));
    }
    return this._http.get<BuildingDetails>(
      `${environment.apiUrl}/api/v1/buildings/${buildingQueried}`
    );
  }

  deleteBuilding(buildingId: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${buildingId}`);
  }

  restoreBuilding(buildingId: string): Observable<BuildingDetails> {
    return this._http.post<BuildingDetails>(
      `${this._baseUrl}/${buildingId}/restore`,
      {}
    );
  }
}
