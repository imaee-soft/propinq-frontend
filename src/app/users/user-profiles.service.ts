import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ProfileChange } from '../auth/interfaces/user-auth.interface';
import { LargePage } from '../shared/interfaces/page.interface';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/user-profiles`;

  saveOwnerProfileRequest(): Observable<any> {
    return this._http.post(
      `${this._baseUrl}/owner-request`,
      {},
      {
        observe: 'response',
      },
    );
  }

  getProfileChanges(
    page: number,
    size: number = 6,
  ): Observable<LargePage<ProfileChange>> {
    return this._http.get<LargePage<ProfileChange>>(
      `${this._baseUrl}/requests?page=${page}&size=${size}`,
    );
  }

  acceptProfileChange(profileChangeId: string) {
    return this._http.patch(
      `${this._baseUrl}/requests/${profileChangeId}/accept`,
      {},
      {
        observe: 'response',
      },
    );
  }

  rejectProfileChange(profileChangeId: string) {
    return this._http.patch(
      `${this._baseUrl}/requests/${profileChangeId}/reject`,
      {},
      {
        observe: 'response',
      },
    );
  }
}
