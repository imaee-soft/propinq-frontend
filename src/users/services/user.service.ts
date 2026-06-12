import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { EMPTY, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment.development";


@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  isLoading = signal(false);

    resendActivationEmail(email: string):Observable<{success: boolean; status: number}> {
      if (this.isLoading()) {
        return EMPTY;
      }
      this.isLoading.set(true);
      return this.http.post<{success: boolean; status: number}>(`${environment.apiUrl}/api/v1/users/resend-activation-email`, { email })
      .pipe(
        tap({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
          complete: () => this.isLoading.set(false)
        })
      );
    }

    activateUser(email: string, verificationCode: string): Observable<{ success: boolean; status: number }> {
      if (this.isLoading()) {
        return EMPTY;
      }
      this.isLoading.set(true);
      return this.http.post<{ success: boolean; status: number }>(`${environment.apiUrl}/api/v1/users/activate`, { email, verificationCode })
        .pipe(
          tap({
            next: () => this.isLoading.set(false),
            error: () => this.isLoading.set(false),
            complete: () => this.isLoading.set(false)
          })
        );
    }
}
