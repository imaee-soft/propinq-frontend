import { inject, Injectable } from '@angular/core';
import { CustomSnackbarService } from './snackbar.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _snackbarService = inject(CustomSnackbarService);

  success(message: string, duration = 3000) {
    this._snackbarService.success(message, duration);
  }

  error(message: string, duration = 3000) {
    this._snackbarService.error(message, duration);
  }
}
