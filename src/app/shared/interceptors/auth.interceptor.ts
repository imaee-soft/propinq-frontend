import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _EXCLUDED_BEARER_ROUTES = ['/auth'];
  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.shouldExcludeBearerRoute(req.url)) return next.handle(req);

    const authService = this.injector.get(AuthService);
    const accessToken = authService.accessToken();
    if (!accessToken) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.refreshTokenRequest().pipe(
            switchMap(() => {
              const newAccessToken = authService.accessToken();
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

  private shouldExcludeBearerRoute(url: string): boolean {
    try {
      const path = new URL(url, window.location.origin).pathname;
      return this._EXCLUDED_BEARER_ROUTES.some((route) =>
        path.startsWith(route)
      );
    } catch {
      return this._EXCLUDED_BEARER_ROUTES.some((route) =>
        url.startsWith(route)
      );
    }
  }
}
