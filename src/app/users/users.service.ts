import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from './interfaces/user-response';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly _http = inject(HttpClient);
  private readonly _authService = inject(AuthService);

  private _baseUrl = `${environment.apiUrl}/api/v1/users`;

  getUserProfile(userId: string): Observable<UserResponse> {
    return this._http.get<UserResponse>(`${this._baseUrl}/${userId}`);
  }
}
