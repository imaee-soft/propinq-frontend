import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  showError(message: string, duration = 3000) {
    this._snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: 'error-snackbar',
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
