import { SignupRequest } from './../interfaces/signupRequest.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../enums/auth-status.enum';
import { Role } from '../enums/role.enum';
import { AuthState } from '../interfaces/auth-state.interface';
import { environment } from '../../../environments/environment.development';
import { EMPTY, tap, Observable } from 'rxjs';

const INITIAL_STATE: AuthState = {
  user: {
    id: '0362aba9-e4d9-4ff3-8b5a-886ee42ff468',
    firstName: 'John',
    lastName: 'Doe',
    email: '',
    role: Role.OWNER,
    phoneNumber: '',
  },
  status: AuthStatus.AUTHENTICATED,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _authState = signal(INITIAL_STATE);
  private http = inject(HttpClient);

  user = computed(() => this._authState().user);
  status = computed(() => this._authState().status);
  isLoading = signal(false);

  saveUserToLocalStorage(userData: SignupRequest): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getUserFromLocalStorage(): SignupRequest | null {
    const data = localStorage.getItem('user');
    localStorage.removeItem('user');
    if (!data) return null;

    try {
      return JSON.parse(data) as SignupRequest;
    } catch {
      return null;
    }
  }

  logout() {
    this._authState.set({
      user: null,
      status: AuthStatus.UNAUTHENTICATED,
    });
  }

  signup(signupRequest: SignupRequest): Observable<{ success: boolean; status: number }> {
    if (this.isLoading()) {
      return EMPTY;
    }

    this.isLoading.set(true);
    this.saveUserToLocalStorage(signupRequest);

    return this.http.post<{ success: boolean; status: number }>(`${environment.API_URL}/auth/signup`, {
      firstName: signupRequest.firstName,
      lastName: signupRequest.lastName,
      email: signupRequest.email,
      password: signupRequest.password,
      address: signupRequest.address,
      phoneNumber: signupRequest.phoneNumber,
      cuit: signupRequest.cuit
    }, { responseType: 'text' as 'json' }).pipe(
      tap({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false),
        complete: () => this.isLoading.set(false)
      })
    );
  }

  resendActivationEmail(email: string):Observable<{success: boolean; status: number}> {
    if (this.isLoading()) {
      return EMPTY;
    }
    this.isLoading.set(true);
    return this.http.post<{success: boolean; status: number}>(`${environment.API_URL}/users/resend-activation-email`, { email })
    .pipe(
      tap({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false),
        complete: () => this.isLoading.set(false)
      })
    );
  }
}


