import {
  Component,
  computed,
  effect,
  inject,
  ResourceStatus,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
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
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
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
import { BuildingRequest } from '../../adapters/building-request';
import { BuildingsService } from '../../buildings.service';
import { BUILDING_CREATED_MESSAGE, BUILDING_ICON_URL } from '../../constants';

interface BuildingFormData {
  name: string;
  description: string;
  type: string;
  address: string;
  coordinate: MapCoordinate | null;
  images: File[] | null;
}

@Component({
  selector: 'new-building-dialog',
  imports: [
    GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatIcon,
    MatTooltip,
    MatOption,
    MatSelect,
    MatHint,
    MatProgressSpinner,
    MapComponent,
    ImageLoaderComponent,
  ],
  templateUrl: './new-building-dialog.component.html',
  styleUrl: './new-building-dialog.component.css',
})
export class NewBuildingDialogComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _buildingsService = inject(BuildingsService);
  private readonly _addressService = inject(AddressService);
  private readonly _authService = inject(AuthService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _matDialogRef = inject(MatDialogRef);

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

  private readonly _createBuildingResource = rxResource({
    request: () => this._buildingRequest(),
    loader: ({ request: buildingRequest }) =>
      buildingRequest
        ? this._buildingsService.createBuilding(buildingRequest)
        : of(null),
  });

  private _textAddress = signal<string>('');
  private _markers = signal<MapMarker[]>([]);
  private _coordinate = computed<MapCoordinate | null>(() => {
    const marker = this._markers()[0];
    return marker ? marker.coordinate : null;
  });
  private _buildingRequest = signal<BuildingRequest | null>(null);

  searchingAddress = computed(
    () =>
      this._textAddressResource.isLoading() ||
      this._coordinateAddressResource.isLoading()
  );

  mapConfig = computed<MapConfig>(() => ({
    center: this._coordinate() || DEFAULT_CENTER,
    markers: this._markers(),
  }));

  isLoading = computed(() => this._createBuildingResource.isLoading());

  form = this._formBuilder.group({
    name: this._formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    description: this._formBuilder.control<string>(''),
    type: this._formBuilder.control<string>('EDIFICIO', [Validators.required]),
    address: this._formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    coordinate: this._formBuilder.control<MapCoordinate | null>(null, [
      Validators.required,
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

  constructor() {
    effect(() => {
      const address = this._textAddressResource.value();
      if (address) this.form.patchValue({ address });
    });

    effect(() => {
      const coordinate = this._coordinateAddressResource.value();
      if (coordinate) this.handleMapClick({ coordinate });
    });

    effect(() => {
      const resource = this._createBuildingResource;
      if (
        resource &&
        resource.status() === ResourceStatus.Resolved &&
        resource.value()?.status === 201
      ) {
        this._notificationService.success(BUILDING_CREATED_MESSAGE, 3000);
        this._matDialogRef.close();
      }
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
        icon: { url: BUILDING_ICON_URL },
        type: 'building',
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

    const { name, description, type, address, coordinate, images } = this.form
      .value as BuildingFormData;

      if (!coordinate) {
        return;
      }
    this._buildingRequest.set({
      type,
      name,
      description,
      address,
      longitude: coordinate?.longitude,
      latitude: coordinate?.latitude,
      userId: this._authService.user()?.userId ?? '',
      images: images || [],
    });
  }

  get nameControl() {
    return this.form.get('name');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  get typeControl() {
    return this.form.get('type');
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
