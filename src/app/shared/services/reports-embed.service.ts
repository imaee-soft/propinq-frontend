import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ReportsEmbedService {

  private _baseUrl = `${environment.apiUrl}/api/v1/reports`;

  private _http = inject(HttpClient);

  getEmbedUrl(
    type: string,
    resourceId: number,
    filters: Record<string, string>
  ): Observable<{ iframeUrl: string }> {
    let params = new HttpParams()
      .set('type', type)
      .set('resourceId', resourceId.toString());
    Object.entries(filters).forEach(([k, v]) => params = params.set(k, v));
    console.log('[REPORTS] Llamando endpoint:', `${this._baseUrl}/metabase/embed-url`, params.toString());

    return this._http.get<{ iframeUrl: string }>(`${this._baseUrl}/metabase/embed-url`, { params });
  }
}
