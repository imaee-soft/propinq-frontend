import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-generic-dialog',
  imports: [
    MatDialogModule,
    CommonModule,
    CdkTrapFocus,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.css',
})
export class GenericDialogComponent {
  dialogTitle = input.required<string>();
  content = contentChild.required('content', { read: TemplateRef });
  activeSaveButton = input<boolean>(false);
}
