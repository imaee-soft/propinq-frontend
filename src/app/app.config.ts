import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { routes } from './app.routes';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppErrorHandler } from './app-error-handler.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GlobalHttpErrorInterceptor } from './interceptors/global-http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpErrorInterceptor, multi: true },
  ],
};
