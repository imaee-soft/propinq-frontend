import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { LocalityResponse} from '../interfaces/locality.interface';
import { LocalityService } from '../services/locality.service';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { ProvinceService } from '../../provinces/services/province.service';


export interface LocalityDialogData {
  locality?: LocalityResponse;
  isEditing: boolean;
}

@Component({
  selector: 'app-new-locality-dialog',
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
  templateUrl: './new-locality-dialog.component.html',
  styleUrl: './new-locality-dialog.component.css'
})
export class NewLocalityDialogComponent {

  private _localityService = inject(LocalityService);
  private _provinceService = inject(ProvinceService);
  provincesList = this._provinceService.getProvinces();

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewLocalityDialogComponent>);

  data = inject<LocalityDialogData>(MAT_DIALOG_DATA);

  localityForm: FormGroup = this.fb.group({
    name: [this.data.locality?.name || '', [Validators.required, Validators.minLength(2)]],
    provinceId: [this.data.locality?.provinceId|| '', [Validators.required, Validators.minLength(1)]]
  });

  onSave(): void {
    if (this.localityForm.valid) {
      this.dialogRef.close({
        action: 'save',
        data: this.localityForm.value
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
