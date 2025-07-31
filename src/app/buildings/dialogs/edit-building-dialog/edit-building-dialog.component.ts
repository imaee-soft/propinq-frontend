import { UpdateBuildingRequest } from './../../adapters/update-building-request';
import { ChangeDetectorRef, Component, computed, effect, inject, Inject, OnInit, ResourceStatus, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuildingsService } from '../../buildings.service';
import { BuildingDetails } from '../../interfaces/building-details.interface';
import { NotificationService } from '../../../shared/services/notification.service';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MapComponent } from '../../../maps/components/map/map.component';
import { ImageLoaderComponent } from '../../../shared/components/image-loader/image-loader.component';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';
import { ImageValidator } from '../../../shared/pipes/image.validator';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs/internal/observable/of';
import { from } from 'rxjs/internal/observable/from';
import { catchError } from 'rxjs/internal/operators/catchError';

interface NewImagePreview {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'edit-building-dialog',
  imports: [GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatIcon,
    MatOption,
    MatSelect,
  ],
  templateUrl: './edit-building-dialog.component.html',
  styleUrls: ['./edit-building-dialog.component.css'],
})
export class EditBuildingDialogComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _buildingsService = inject(BuildingsService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _matDialogRef = inject(MatDialogRef);

  private updateRequest = signal<UpdateBuildingRequest | null>(null);
  isLoading = computed(() => this.updateResource.isLoading());
  existingImageUrls = signal<string[]>([]);
  newImageFiles = signal<NewImagePreview[]>([]);
  hasAtLeastOneImage = computed(() => this.existingImageUrls().length > 0 || this.newImageFiles().length > 0);

  public data: { building: BuildingDetails } = inject(MAT_DIALOG_DATA);

  form = this._formBuilder.group({
    name: this._formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    description: this._formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    type: this._formBuilder.control<string>('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      if (this.updateResource.status() === ResourceStatus.Resolved && this.updateResource.value()) {
        this._notificationService.success('Inmueble actualizado correctamente');
        this._matDialogRef.close(true);
      }
    });
  }

  private updateResource = rxResource({
    request: () => this.updateRequest(),
    loader: ({ request }) =>
      request
        ? this._buildingsService.updateBuilding(request)
        : of(null),
  });

  ngOnInit(): void {
    this.form.patchValue({
      name: this.data.building.name,
      description: this.data.building.description,
      type: this.data.building.buildingTypeName,
    });
    this.existingImageUrls.set(this.data.building.imagesURL || []);
  }

  removeExistingImage(urlToRemove: string): void {
    this.existingImageUrls.update(urls => urls.filter(url => url !== urlToRemove));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const newPreviews: NewImagePreview[] = files.map(file => ({
      file: file,
      previewUrl: URL.createObjectURL(file)
    }));
    this.newImageFiles.update(current => [...current, ...newPreviews]);
  }

  removeNewImage(indexToRemove: number): void {
    this.newImageFiles.update(current => {
      URL.revokeObjectURL(current[indexToRemove].previewUrl);
      return current.filter((_, index) => index !== indexToRemove);
    });
  }


  handleSubmit():void {
    if (this.form.invalid || !this.hasAtLeastOneImage()) {
      this.form.markAllAsTouched();
      this._notificationService.error('Por favor, complete todos los campos y asegúrese de que haya al menos una imagen.');
      return;
    }
    const formValue = this.form.value;
    this.updateRequest.set({
      id: this.data.building.buildingId,
      payload: { name: formValue.name!, description: formValue.description!, type: formValue.type!, existingImagesURLS: this.existingImageUrls(), imageFiles: this.newImageFiles().map(img => img.file) },
    });
  }


  get nameControl() {
    return this.form.get('name');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  get imagesControl() {
    return this.form.get('images');
  }

}
