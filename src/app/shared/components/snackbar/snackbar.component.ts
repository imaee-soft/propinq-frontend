import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SnackbarConfig } from '../../interfaces/snackbar-config.interface';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule, MatIcon],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent implements OnInit {
  config!: SnackbarConfig;
  onClose!: () => void;

  get icon(): string {
    switch (this.config.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }

  ngOnInit() {
    this.updatePosition();
  }

  private updatePosition() {
    if (this.config.position?.includes('bottom')) {
      (this.onClose as any).element = document.querySelector(
        '.snackbar:last-child'
      );
    }
  }
}
