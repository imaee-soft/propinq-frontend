import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProvinceResponse } from '../interfaces/province.interface';

@Injectable({ providedIn: 'root' })
export class ProvinceService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/provinces`;

  getProvinces(): Observable<ProvinceResponse[]> {
    return this.http.get<ProvinceResponse[]>(this.baseUrl);
  }
}
