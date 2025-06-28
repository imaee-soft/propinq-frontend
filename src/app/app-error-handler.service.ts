
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const snackBar = this.injector.get(MatSnackBar);
    // Muestra el snackbar con un mensaje genérico (o usa el mensaje del error si prefieres)
    snackBar.open(
      error?.message || 'Ocurrió un error inesperado',
      'Cerrar',
      { duration: 4000, verticalPosition: 'bottom' }
    );
  }
}
