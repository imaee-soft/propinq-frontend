import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PropertyDetails } from '../properties/interfaces/property-details.interface';
import { BuildingRequest } from './adapters/building-request';
import { UpdateBuildingRequest } from './adapters/update-building-request';
import { BuildingDetails } from './interfaces/building-details.interface';
import { Building } from './interfaces/building.interface';
import { BuildingDetailsPage } from './interfaces/buildings-details-page.interface';

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

  getBuildingsDetails(
    page = 0,
    pageSize = 15
  ): Observable<BuildingDetailsPage> {
    return this._http
      .get<BuildingDetailsPage>(
        `${environment.apiUrl}/api/v1/buildings/details`,
        {
          params: { page, size: pageSize },
        }
      )
      .pipe(
        map((response) => {
          const content = response.content.map((building: any) => ({
            ...building,
            buildingId: building.buildingId,
          }));
          return { ...response, content: content };
        })
      );
  }

  updateBuilding(
    updateBuildingRequest: UpdateBuildingRequest
  ): Observable<BuildingDetails> {
    const formData = new FormData();
    const { payload, id } = updateBuildingRequest;

    const { imageFiles, ...buildingData } = payload;

    formData.append(
      'building',
      new Blob([JSON.stringify(buildingData)], {
        type: 'application/json',
      })
    );

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file, file.name);
      });
    }

    return this._http.patch<BuildingDetails>(
      `${this._baseUrl}/${id}`,
      formData
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

  getBuildingProperties(buildingId: string): Observable<PropertyDetails[]> {
    return this._http.get<PropertyDetails[]>(
      `${this._baseUrl}/${buildingId}/properties`
    );
  }

  hasApartment(buildingId: string, number: string): Observable<boolean> {
    const params = { number };
    return this._http.get<boolean>(
      `${this._baseUrl}/${buildingId}/has-apartment`,
      {
        params,
      }
    );
  }
}
