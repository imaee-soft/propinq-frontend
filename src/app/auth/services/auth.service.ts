import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ClientStorageService } from '../../shared/services/client-storage.service.abstract';
import { AuthStatus } from '../enums/auth-status.enum';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { AuthState } from '../interfaces/auth-state.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { UserAuth } from '../interfaces/user-auth.interface';

const INITIAL_STATE: AuthState = {
  user: null,
  status: AuthStatus.AUTHENTICATED,
  accessToken: null,
  refreshToken: null,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _storage = inject(ClientStorageService);
  private readonly _http = inject(HttpClient);
  private readonly _authState = signal(INITIAL_STATE);

  user = computed(() => this._authState().user);
  status = computed(() => this._authState().status);
  accessToken = computed(() => this._authState().accessToken);
  refreshToken = computed(() => this._authState().refreshToken);

  constructor() {
    this.checkStatus().subscribe({
      next: (user) => {
        const status = user
          ? AuthStatus.AUTHENTICATED
          : AuthStatus.UNAUTHENTICATED;
        const { accessToken, refreshToken } = this.getTokens();
        this._authState.set({ accessToken, refreshToken, user, status });
      },
      error: () => {
        this.logout();
      },
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          const { accessToken, refreshToken, user } = response;
          this._authState.set({
            accessToken,
            refreshToken,
            user,
            status: AuthStatus.AUTHENTICATED,
          });
          this.setTokens(accessToken, refreshToken);
        })
      );
  }

  checkStatus(): Observable<UserAuth | null> {
    const accessToken = this._storage.get<string>('accessToken');
    if (!accessToken) return of(null);
    return this._http.post<UserAuth>(`${environment.apiUrl}/auth/check-token`, {
      accessToken,
    });
  }

  logout(): void {
    this.clearTokens();
    window.location.reload();
  }

  private getTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    return {
      accessToken: this._storage.get<string>('accessToken'),
      refreshToken: this._storage.get<string>('refreshToken'),
    };
  }

  private clearTokens(): void {
    console.log('Clearing auth tokens');
    this._storage.remove('accessToken');
    this._storage.remove('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this._storage.set('accessToken', accessToken);
    this._storage.set('refreshToken', refreshToken);
  }
}
