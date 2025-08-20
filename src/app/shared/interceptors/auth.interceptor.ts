import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
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

    const accessToken = this.injector.get(AuthService).accessToken();
    if (!accessToken) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authReq);
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
