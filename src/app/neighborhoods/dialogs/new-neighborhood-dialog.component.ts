import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { NeighborhoodResponse} from '../interfaces/neighborhood.interface';
import { NeighborhoodService } from '../services/neighborhood.service';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { LocalityService } from '../../localities/services/locality.service';


export interface NeighborhoodDialogData {
  neighborhood?: NeighborhoodResponse;
  isEditing: boolean;
}

@Component({
  selector: 'app-new-neighborhood-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatOption,
    MatSelect
],
  templateUrl: './new-neighborhood-dialog.component.html',
  styleUrl: './new-neighborhood-dialog.component.css'
})
export class NewNeighborhoodDialogComponent {

  private _localityService = inject(LocalityService);
  localitiesList = this._localityService.getLocalities();

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewNeighborhoodDialogComponent>);

  data = inject<NeighborhoodDialogData>(MAT_DIALOG_DATA);

  neighborhoodForm: FormGroup = this.fb.group({
    name: [this.data.neighborhood?.name || '', [Validators.required, Validators.minLength(2)]],
    localityId: [this.data.neighborhood?.localityId|| '', [Validators.required, Validators.minLength(1)]]
  });

  onSave(): void {
    if (this.neighborhoodForm.valid) {
      this.dialogRef.close({
        action: 'save',
        data: this.neighborhoodForm.value
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
