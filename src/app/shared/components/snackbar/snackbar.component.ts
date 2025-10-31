import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SnackbarConfig } from '../../interfaces/snackbar-config.interface';

const ICON_MAP = {
  success: 'check_circle',
  error: 'error',
};

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule, MatIcon],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  config!: SnackbarConfig;
  onClose!: () => void;

  get icon(): string {
    return ICON_MAP[this.config.type];
  }
}
