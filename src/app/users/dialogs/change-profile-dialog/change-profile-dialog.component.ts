import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-change-profile-dialog',
  imports: [GenericDialogComponent, MatIconModule],
  templateUrl: './change-profile-dialog.component.html',
  styleUrl: './change-profile-dialog.component.css',
})
export class ChangeProfileDialogComponent {
  private _matDialogRef = inject(MatDialogRef);
  isLoading = signal(false);
}
