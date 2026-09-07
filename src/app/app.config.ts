import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  APP_INITIALIZER,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ClientStorageService } from './shared/services/client-storage.service.abstract';
import { LocalStorageService } from './shared/services/local-storage.service';
import { RuntimeConfigService } from './shared/services/runtime-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  importProvidersFrom(MatSnackBarModule, ReactiveFormsModule),
    {
      provide: APP_INITIALIZER,
      useFactory: (runtimeConfig: RuntimeConfigService) => () =>
        runtimeConfig.load(),
      deps: [RuntimeConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    { provide: ClientStorageService, useClass: LocalStorageService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
