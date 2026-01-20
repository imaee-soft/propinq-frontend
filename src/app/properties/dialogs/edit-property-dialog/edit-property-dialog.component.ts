import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { PropertyDetails } from '../../interfaces/property-details.interface';
import { UpdatePropertyRequest } from '../../interfaces/update-property-request.interface';
import { PropertiesService } from '../../properties.service';

interface NewImagePreview {
  file: File;
  previewUrl: string;
}

const PROPERTY_UPDATED = 'La propiedad fue actualizada con éxito!';

@Component({
  selector: 'edit-property-dialog',
  imports: [
    GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSlideToggleModule,
    MatIcon,
  ],
  templateUrl: './edit-property-dialog.component.html',
  styleUrl: './edit-property-dialog.component.css',
})
export class EditPropertyDialogComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _propertiesService = inject(PropertiesService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _matDialogRef = inject(MatDialogRef);

  updateRequest = signal<UpdatePropertyRequest | null>(null);
  isLoading = computed(() => this.updateResource.isLoading());
  existingImageUrls = signal<string[]>([]);
  newImageFiles = signal<NewImagePreview[]>([]);
  hasAtLeastOneImage = computed(
    () =>
      this.existingImageUrls().length > 0 || this.newImageFiles().length > 0,
  );

  public data: { property: PropertyDetails } = inject(MAT_DIALOG_DATA);

  form = this._formBuilder.group({
    title: this._formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    price: this._formBuilder.control<number>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    bedrooms: this._formBuilder.control<number>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    bathrooms: this._formBuilder.control<number>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    petsAllowed: this._formBuilder.control<boolean>(false, [
      Validators.required,
    ]),
    furnishing: this._formBuilder.control<boolean>(false, [
      Validators.required,
    ]),
    expenses: this._formBuilder.control<boolean>(false, [Validators.required]),
    description: this._formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  constructor() {
    effect(() => {
      if (this.updateResource.status() === 'resolved') {
        this._notificationService.success(PROPERTY_UPDATED);
        this._matDialogRef.close(true);
      }
    });
  }

  private updateResource = {
    status: signal<'idle' | 'loading' | 'resolved' | 'error'>('idle'),
    value: signal(null),
    isLoading: () => this.updateResource.status() === 'loading',
    trigger: async () => {
      this.updateResource.status.set('loading');
      try {
        const request = this.updateRequest();
        if (request) {
          await this._propertiesService.updateProperty(request).toPromise();
          this.updateResource.status.set('resolved');
          this.updateResource.value.set(null);
        } else {
          this.updateResource.status.set('resolved');
          this.updateResource.value.set(null);
        }
      } catch {
        this.updateResource.status.set('error');
        this.updateResource.value.set(null);
      }
    },
  };

  ngOnInit(): void {
    this.form.patchValue({
      title: this.data.property.title,
      price: this.data.property.price,
      bedrooms: this.data.property.bedrooms,
      bathrooms: this.data.property.bathrooms,
      petsAllowed: this.data.property.petsAllowed,
      furnishing: this.data.property.furnishing,
      expenses: this.data.property.expenses,
      description: this.data.property.description,
    });
    this.existingImageUrls.set(this.data.property.imagesURL || []);
  }

  removeExistingImage(urlToRemove: string): void {
    this.existingImageUrls.update((urls) =>
      urls.filter((url) => url !== urlToRemove),
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const newPreviews: NewImagePreview[] = files.map((file) => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));
    this.newImageFiles.update((current) => [...current, ...newPreviews]);
  }

  removeNewImage(indexToRemove: number): void {
    this.newImageFiles.update((current) => {
      URL.revokeObjectURL(current[indexToRemove].previewUrl);
      return current.filter((_, index) => index !== indexToRemove);
    });
  }

  handleSubmit(): void {
    if (this.form.invalid || !this.hasAtLeastOneImage()) {
      this.form.markAllAsTouched();
      this._notificationService.error(
        'Por favor, complete todos los campos y asegúrese de que haya al menos una imagen.',
      );
      return;
    }
    const formValue = this.form.value;
    this.updateRequest.set({
      id: this.data.property.propertyId,
      payload: {
        title: formValue.title!,
        description: formValue.description!,
        type: 'CASA',
        existingImagesURLS: this.existingImageUrls(),
        imageFiles: this.newImageFiles().map((img) => img.file),
        price: formValue.price!,
        bedrooms: formValue.bedrooms!,
        bathrooms: formValue.bathrooms!,
        petsAllowed: formValue.petsAllowed!,
        furnishing: formValue.furnishing!,
        expenses: formValue.expenses!,
      },
    });
    this.updateResource.trigger();
  }

  get titleControl() {
    return this.form.get('title');
  }
  get priceControl() {
    return this.form.get('price');
  }
  get bedroomsControl() {
    return this.form.get('bedrooms');
  }
  get bathroomsControl() {
    return this.form.get('bathrooms');
  }
  get petsAllowedControl() {
    return this.form.get('petsAllowed');
  }
  get furnishingControl() {
    return this.form.get('furnishing');
  }
  get expensesControl() {
    return this.form.get('expenses');
  }
  get descriptionControl() {
    return this.form.get('description');
  }
  get imagesControl() {
    return this.form.get('images');
  }
}
