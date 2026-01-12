import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { BUILDING_ICON_URL } from '../../../buildings/constants';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapClickEvent } from '../../../maps/interfaces/click-event.interface';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { MapCoordinate } from '../../../maps/interfaces/map-coordinate.interface';
import { MapMarker } from '../../../maps/interfaces/map-marker.interface';
import { AddressService } from '../../../maps/services/address.service';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { ImageLoaderComponent } from '../../../shared/components/image-loader/image-loader.component';
import { ImageValidator } from '../../../shared/pipes/image.validator';
import { NotificationService } from '../../../shared/services/notification.service';
import { PropertiesService } from '../../properties.service';

interface HouseFormData {
  price: number;
  bedrooms: number;
  bathrooms: number;
  petsAllowed: boolean;
  hasFurniture: boolean;
  paysExpenses: boolean;
  description: string;
  address: string;
  images: File[] | null;
}

const CASA_TYPE = 'CASA';
const PROPERTY_CREATED = 'La vivienda fue creada con éxito!';

@Component({
  selector: 'new-house-dialog',
  imports: [
    GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSlideToggleModule,
    ImageLoaderComponent,
    MatHint,
    MatProgressSpinner,
    MatIcon,
    MapComponent,
    MatButtonModule,
  ],
  templateUrl: './new-house-dialog.component.html',
  styleUrl: './new-house-dialog.component.css',
})
export class NewHouseDialogComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _propertiesService = inject(PropertiesService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _matDialogRef = inject(MatDialogRef);
  private readonly _authService = inject(AuthService);
  private readonly _addressService = inject(AddressService);

  private _textAddress = signal<string>('');
  private _markers = signal<MapMarker[]>([]);
  private _coordinate = computed<MapCoordinate | null>(() => {
    const marker = this._markers()[0];
    return marker ? marker.coordinate : null;
  });

  private readonly _textAddressResource = rxResource({
    request: () => this._coordinate(),
    loader: ({ request: coordinate }) =>
      coordinate ? this._addressService.decodeAddress(coordinate) : of(null),
  });

  private readonly _coordinateAddressResource = rxResource({
    request: () => this._textAddress(),
    loader: ({ request: address }) =>
      address ? this._addressService.geocodeAddress(address) : of(null),
  });

  user = this._authService.user();
  isLoading = signal(false);
  form: ReturnType<FormBuilder['group']>;
  searchingAddress = computed(
    () =>
      this._textAddressResource.isLoading() ||
      this._coordinateAddressResource.isLoading()
  );
  mapConfig = computed<MapConfig>(() => ({
    center: this._coordinate() || DEFAULT_CENTER,
    markers: this._markers(),
  }));

  constructor() {
    this.form = this._formBuilder.group({
      price: this._formBuilder.control<number>(100000, [
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
      petsAllowed: this._formBuilder.control<boolean>(true, [
        Validators.required,
      ]),
      hasFurniture: this._formBuilder.control<boolean>(true, [
        Validators.required,
      ]),
      paysExpenses: this._formBuilder.control<boolean>(true, [
        Validators.required,
      ]),
      description: this._formBuilder.control<string>(''),
      address: this._formBuilder.control<string>('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      images: this._formBuilder.control<File[] | null>(
        [],
        [
          Validators.required,
          ImageValidator.maxSize(3 * 1024 * 1024),
          ImageValidator.allowedTypes(['jpg', 'jpeg', 'png', 'webp']),
        ]
      ),
    });

    effect(() => {
      const address = this._textAddressResource.value();
      if (address) this.form.patchValue({ address });
    });

    effect(() => {
      const coordinate = this._coordinateAddressResource.value();
      if (coordinate) this.handleMapClick({ coordinate });
    });
  }

  handleSearchAddress() {
    const address = this.form.get('address')?.value;
    if (address) this._textAddress.set(address);
  }

  handleMapClick({ coordinate }: MapClickEvent) {
    this._markers.update(() => [
      {
        coordinate,
        icon: { url: '/property.png' },
        type: 'property',
      },
    ]);
    this.form.patchValue({ coordinate });
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
      price,
      bedrooms,
      bathrooms,
      hasFurniture,
      paysExpenses,
      petsAllowed,
      description,
      address,
    } = this.form.value as HouseFormData;

    this._propertiesService
      .createProperty({
        price,
        address,
        bedrooms,
        bathrooms,
        petsAllowed: petsAllowed || false,
        hasFurniture: hasFurniture || false,
        paysExpenses: paysExpenses || false,
        description: description || '',
        type: CASA_TYPE,
        images: this.currentImages,
        userId: this.user?.userId,
        latitude: this._coordinate()?.latitude,
        longitude: this._coordinate()?.longitude,
      })
      .subscribe({
        next: () => {
          this._notificationService.success(PROPERTY_CREATED, 3000);
          this._matDialogRef.close();
          location.reload();
        },
        error: () => this.isLoading.set(false),
      });
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

  get addressControl() {
    return this.form.get('address');
  }

  get imagesControl() {
    return this.form.get('images');
  }

  get currentImages() {
    return (this.imagesControl?.value as File[]) || [];
  }
}
