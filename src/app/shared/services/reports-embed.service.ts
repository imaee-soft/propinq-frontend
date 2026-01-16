import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsEmbedService {
  constructor(private http: HttpClient) {}

  getEmbedUrl(
    type: string,
    resourceId: number,
    filters: Record<string, string>
  ): Observable<{ iframeUrl: string }> {
    let params = new HttpParams()
      .set('type', type)
      .set('resourceId', resourceId.toString());
    Object.entries(filters).forEach(([k, v]) => params = params.set(k, v));
    return this.http.get<{ iframeUrl: string }>('/api/v1/reports/metabase/embed-url', { params });
  }
}
