import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BuildingsService } from '../../../buildings/buildings.service';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { ImageLoaderComponent } from '../../../shared/components/image-loader/image-loader.component';
import { ImageValidator } from '../../../shared/pipes/image.validator';
import { NotificationService } from '../../../shared/services/notification.service';
import { PropertiesService } from '../../properties.service';
import { numberValidator } from '../../validators/number.validator';

interface PropertyFormData {
  number: string;
  floor: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  petsAllowed: boolean;
  description: string;
  images: File[] | null;
}

const APARTAMENTO_TYPE = 'APARTAMENTO';
const PROPERTY_CREATED = 'La propiedad fue creada con éxito!';

@Component({
  selector: 'new-property-dialog',
  imports: [
    GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSlideToggleModule,
    ImageLoaderComponent,
  ],
  templateUrl: './new-property-dialog.component.html',
  styleUrl: './new-property-dialog.component.css',
})
export class NewPropertyDialogComponent implements AfterViewInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _propertiesService = inject(PropertiesService);
  private readonly _buildingsService = inject(BuildingsService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _matDialogRef = inject(MatDialogRef);

  private buildingNameField = viewChild<ElementRef>('buildingNameField');

  form: ReturnType<FormBuilder['group']>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { buildingId: string; buildingName: string }
  ) {
    this.form = this._formBuilder.group({
      number: this._formBuilder.control<string>('', {
        validators: [Validators.required],
        asyncValidators: [
          numberValidator(this.data.buildingId, this._buildingsService),
        ],
        updateOn: 'blur',
      }),
      floor: this._formBuilder.control<number>(0, [
        Validators.required,
        Validators.min(0),
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
      area: this._formBuilder.control<number>(0, [Validators.min(0)]),
      petsAllowed: this._formBuilder.control<boolean>(true, [
        Validators.required,
      ]),
      description: this._formBuilder.control<string>(''),
      images: this._formBuilder.control<File[] | null>(
        [],
        [
          Validators.required,
          ImageValidator.maxSize(3 * 1024 * 1024),
          ImageValidator.allowedTypes(['jpg', 'jpeg', 'png', 'webp']),
        ]
      ),
    });
  }

  isLoading = signal(false);

  ngAfterViewInit() {
    if (this.buildingNameField()) {
      const input = this.buildingNameField()?.nativeElement;
      if (input) {
        input.value = this.data.buildingName;
        input.focus();
      }
    }
  }

  handleImageUploaded(files: File[]) {
    const updatedFiles = [...this.currentImages, ...files];
    this.uploadImagesAndMarkTouchedControl(updatedFiles);
  }

  handleImageRemoved(index: number) {
    const updatedFiles = this.currentImages.filter((_, i) => i !== index);
    this.uploadImagesAndMarkTouchedControl(updatedFiles);
  }

  uploadImagesAndMarkTouchedControl(updatedImages: File[]) {
    this.form.patchValue({ images: updatedImages });
    this.form.get('images')?.markAsTouched();
  }

  handleSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const {
      number,
      floor,
      price,
      bedrooms,
      bathrooms,
      area,
      petsAllowed,
      description,
    } = this.form.value as PropertyFormData;

    this._propertiesService
      .createProperty({
        number,
        floor,
        price,
        bedrooms,
        bathrooms,
        area: area || undefined,
        petsAllowed: petsAllowed || false,
        description: description || '',
        type: APARTAMENTO_TYPE,
        buildingId: this.data.buildingId,
        images: this.currentImages,
      })
      .subscribe({
        next: () => {
          this._notificationService.success(PROPERTY_CREATED, 3000);
          this._matDialogRef.close();
        },
        error: () => this.isLoading.set(false),
      });
  }

  get numberControl() {
    return this.form.get('number');
  }

  get floorControl() {
    return this.form.get('floor');
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

  get areaControl() {
    return this.form.get('area');
  }

  get petsAllowedControl() {
    return this.form.get('petsAllowed');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  get imagesControl() {
    return this.form.get('images');
  }

  get currentImages() {
    return (this.imagesControl?.value as File[]) || [];
  }
}
