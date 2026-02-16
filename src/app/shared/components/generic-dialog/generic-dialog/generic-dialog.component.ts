import { CommonModule } from '@angular/common';
import {
  Component,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-generic-dialog',
  imports: [
    MatDialogModule,
    MatIcon,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.css',
})
export class GenericDialogComponent {
  dialogTitle = input.required<string>();
  submitTitle = input<string>('Guardar');
  isLoading = input<boolean>(false);
  content = contentChild.required('content', { read: TemplateRef });
  activeSaveButton = input<boolean>(false);
  submit = output<void>();
}
