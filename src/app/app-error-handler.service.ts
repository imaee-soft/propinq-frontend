
import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  _snackBar = inject(MatSnackBar);

  handleError(error: any): void {
    this._snackBar.open(
      error?.message || 'Ocurrió un error inesperado',
      'Cerrar',
      { duration: 4000, verticalPosition: 'bottom' }
    );
  }
}
