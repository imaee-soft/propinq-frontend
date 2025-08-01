import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly _notificationService = inject(NotificationService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Para errores 409 (CONFLICT), preservar información adicional
        if (error.status === 409) {
          const errorMessage = 'CONFLICT_ERROR: La inmobiliaria ya se encuentra registrada';
          this._notificationService.error('No se puede registrar la inmobiliaria porque ya se encuentra registrada', 3000);
          
          // Crear un error que preserve el status original
          const customError = new Error(errorMessage);
          (customError as any).originalStatus = 409;
          (customError as any).originalError = error;
          
          return throwError(() => customError);
        }
        
        // Para otros errores, comportamiento normal
        const errorMessage =
          error.error?.message ||
          'Ocurrió un error inesperado. Contacte a un administrador.';
        this._notificationService.error(errorMessage, 3000);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
