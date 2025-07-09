import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BuildingRequest } from './adapters/building-request';

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
}
