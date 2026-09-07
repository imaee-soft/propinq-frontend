import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment.development';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _EXCLUDED_BEARER_ROUTES = ['/auth'];
  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only attach Authorization for requests targeting our API origin
    if (!this.isApiRequest(req.url)) {
      return next.handle(req);
    }

    if (this.shouldExcludeBearerRoute(req.url)) return next.handle(req);

    const authService = this.injector.get(AuthService);
    const { accessToken } = authService['getTokens']();
    if (!accessToken) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.refreshTokenRequest().pipe(
            switchMap(() => {
              const { accessToken: newAccessToken } = authService['getTokens']();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` },
              });
              return next.handle(retryReq);
            }),
            catchError((refreshError) => {
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private isApiRequest(url: string): boolean {
    try {
      const target = new URL(url, window.location.origin);
      // Relative apiUrl like '/api/v1' has no origin — treat as same-origin API
      if (environment.apiUrl.startsWith('/')) {
        return target.pathname.startsWith(environment.apiUrl) ||
          target.pathname.startsWith('/api/');
      }
      const apiBase = new URL(environment.apiUrl);
      return target.origin === apiBase.origin;
    } catch {
      return url.startsWith('/api/') || url.startsWith('api/');
    }
  }

  private shouldExcludeBearerRoute(url: string): boolean {
    try {
      const path = new URL(url, window.location.origin).pathname;
      return this._EXCLUDED_BEARER_ROUTES.some((route) =>
        path.includes(route)
      );
    } catch {
      return this._EXCLUDED_BEARER_ROUTES.some((route) =>
        url.includes(route)
      );
    }
  }
}
