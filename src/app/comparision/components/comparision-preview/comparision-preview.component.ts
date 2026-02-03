import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { formatDate } from '../../../shared/utilities/date.pipes';
import { ComparisionService } from '../../comparision.service';

@Component({
  selector: 'app-comparision-preview',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './comparision-preview.component.html',
  styleUrls: ['./comparision-preview.component.css'],
})
export class ComparisionPreviewComponent {
  private _matDialogRef = inject(MatDialogRef);
  private _comparisionService = inject(ComparisionService);
  properties = computed(() => this._comparisionService.properties());

  formatDateWrapper(date: Date) {
    return formatDate(date);
  }

  removeFromComparativeList(index: number) {
    this._comparisionService.removeFromComparative(index);
  }

  clear() {
    this._comparisionService.clearComparativeList();
  }

  compare() {
    this._matDialogRef.close(true);
  }

  closeDialog() {
    this._matDialogRef.close();
  }
}
