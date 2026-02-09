import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RentProjection } from '../../interfaces/rent-projection.interface';

@Component({
  selector: 'app-projection-dialog',
  imports: [MatDialogModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './projection-dialog.component.html',
  styleUrl: './projection-dialog.component.css',
})
export class ProjectionDialogComponent {
  private _data: RentProjection[] = inject(MAT_DIALOG_DATA);
  currentProjection = this._data[0];
  nextProjection = this._data[1];

  getPreviousMonth(date: Date): Date {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() - 1, 1);
  }
}
