import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { of } from 'rxjs';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapClickEvent } from '../../../maps/interfaces/click-event.interface';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { MapCoordinate } from '../../../maps/interfaces/map-coordinate.interface';
import { MapMarker } from '../../../maps/interfaces/map-marker.interface';
import { AddressService } from '../../../maps/services/address.service';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { ImageLoaderComponent } from '../../../shared/components/image-loader/image-loader.component';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

interface BuildingFormData {
  name: string;
  description: string;
  address: string;
}

const url = 'icons/building.png';

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
    MatProgressSpinner,
    MapComponent,
    ImageLoaderComponent,
    UppercaseDirective,
  ],
  templateUrl: './new-building-dialog.component.html',
  styleUrl: './new-building-dialog.component.css',
})
export class NewBuildingPageComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _addressService = inject(AddressService);

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

  private _textAddress = signal<string>('');

  private _markers = signal<MapMarker[]>([]);
  private _coordinate = computed<MapCoordinate | null>(() => {
    const marker = this._markers()[0];
    return marker ? marker.coordinate : null;
  });

  private _addressFetched = computed(() => this._textAddressResource.value());
  private _coordinateFetched = computed(() =>
    this._coordinateAddressResource.value()
  );

  searchingAddress = computed(
    () =>
      this._textAddressResource.isLoading() ||
      this._coordinateAddressResource.isLoading()
  );

  mapConfig = computed<MapConfig>(() => ({
    center: this._coordinate() || DEFAULT_CENTER,
    markers: this._markers(),
  }));

  form = this._formBuilder.group({
    name: this._formBuilder.control<string>('', [Validators.required]),
    description: this._formBuilder.control<string>(''),
    address: this._formBuilder.control<string>('', [Validators.required]),
    coordinate: this._formBuilder.control<MapCoordinate | null>(null, [
      Validators.required,
    ]),
    images: this._formBuilder.control<File[] | null>([], [Validators.required]),
  });

  constructor() {
    effect(() => {
      const address = this._addressFetched();
      if (address) this.form.patchValue({ address });
    });

    effect(() => {
      const coordinate = this._coordinateFetched();
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
        icon: { url },
      },
    ]);
    this.form.patchValue({ coordinate });
  }

  handleImageUploaded(files: File[]) {
    this.form.patchValue({ images: files });
    this.form.get('images')?.markAsDirty();
  }

  handleImageRemoved(index: number) {
    const currentImages = (this.form.get('images')?.value as File[]) || [];
    const updatedFiles = currentImages.filter((_, i) => i !== index);
    this.form.patchValue({ images: updatedFiles });
    this.form.get('images')?.markAsDirty();
  }

  handleSubmit() {
    if (this.form.valid) {
      const buildingData = this.form.value as BuildingFormData;
      console.log('Building data submitted:', buildingData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  get nameControl() {
    return this.form.get('name');
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
}
