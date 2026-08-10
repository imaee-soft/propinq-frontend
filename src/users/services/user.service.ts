import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { EMPTY, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  isLoading = signal(false);

  resendActivationEmail(email: string): Observable<{ success: boolean; status: number }> {
    if (this.isLoading()) {
      return EMPTY;
    }
    this.isLoading.set(true);
    return this.http
      .post<{ success: boolean; status: number }>(
        `${environment.apiUrl}/api/v1/users/resend-activation-email`,
        { email },
      )
      .pipe(
        tap({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
          complete: () => this.isLoading.set(false),
        }),
      );
  }

  activateUser(
    userId: string,
    activationToken: string,
  ): Observable<{ success: boolean; status: number }> {
    if (this.isLoading()) {
      return EMPTY;
    }
    this.isLoading.set(true);
    return this.http
      .post<{ success: boolean; status: number }>(
        `${environment.apiUrl}/api/v1/users/${userId}/activate`,
        { activationToken },
      )
      .pipe(
        tap({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
          complete: () => this.isLoading.set(false),
        }),
      );
  }

  sendRecoverPasswordEmail(email: string): Observable<void> {
    if (this.isLoading()) {
      return EMPTY;
    }
    this.isLoading.set(true);
    return this.http
      .post<void>(`${environment.apiUrl}/api/v1/users/recover-password/send-email`, {
        email,
      })
      .pipe(
        tap({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
          complete: () => this.isLoading.set(false),
        }),
      );
  }

  recoverPassword(
    password: string,
    confirmPassword: string,
    recoverPasswordToken: string,
  ): Observable<void> {
    if (this.isLoading()) {
      return EMPTY;
    }
    this.isLoading.set(true);
    return this.http
      .post<void>(`${environment.apiUrl}/api/v1/users/recover-password`, {
        password,
        confirmPassword,
        recoverPasswordToken,
      })
      .pipe(
        tap({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
          complete: () => this.isLoading.set(false),
        }),
      );
  }
}
