import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage =
          error.error?.message ||
          error.error?.detail ||
          'Ocurrió un error inesperado. Contacte a un administrador.';
        this._injector.get(NotificationService).error(errorMessage, 3000);
        return throwError(() => error);
      }),
    );
  }
}
