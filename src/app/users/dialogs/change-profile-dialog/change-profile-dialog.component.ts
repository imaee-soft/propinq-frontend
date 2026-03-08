import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { UserProfileService } from '../../user-profiles.service';

@Component({
  selector: 'app-change-profile-dialog',
  imports: [GenericDialogComponent, MatIconModule],
  templateUrl: './change-profile-dialog.component.html',
  styleUrl: './change-profile-dialog.component.css',
})
export class ChangeProfileDialogComponent {
  private _userProfileService = inject(UserProfileService);
  private _matDialogRef = inject(MatDialogRef);

  isLoading = signal(false);

  handleSubmit() {
    this.isLoading.set(true);
    this._userProfileService.saveOwnerProfileRequest().subscribe({
      next: () => {
        this.isLoading.set(false);
        this._matDialogRef.close(true);
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      },
    });
  }
}
