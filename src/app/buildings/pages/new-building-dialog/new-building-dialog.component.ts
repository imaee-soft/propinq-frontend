import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { of } from 'rxjs';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapClickEvent } from '../../../maps/interfaces/click-event.interface';
import { MapConfig } from '../../../maps/interfaces/map-config.interface';
import { MapCoordinate } from '../../../maps/interfaces/map-coordinate.interface';
import { MapMarker } from '../../../maps/interfaces/map-marker.interface';
import { AddressService } from '../../../maps/services/address.service';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { ImageLoaderComponent } from '../../../shared/components/image-loader/image-loader.component';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

interface BuildingFormData {
  name: string;
  description: string;
  address: string;
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
    MapComponent,
    MatButton,
    ImageLoaderComponent,
    UppercaseDirective,
  ],
  templateUrl: './new-building-dialog.component.html',
  styleUrl: './new-building-dialog.component.css',
})
export class NewBuildingPageComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _addressService = inject(AddressService);

  private readonly _addressResource = rxResource({
    request: () => this._coordinate(),
    loader: ({ request: coordinate }) =>
      coordinate ? this._addressService.decodeAddress(coordinate) : of(null),
  });

  private _markers = signal<MapMarker[]>([]);
  private _coordinate = computed<MapCoordinate | null>(() => {
    const marker = this._markers()[0];
    return marker ? marker.coordinate : null;
  });
  private _addressFetched = computed(() => this._addressResource.value());

  mapConfig = computed<MapConfig>(() => ({
    markers: this._markers(),
  }));

  form = this._formBuilder.group({
    name: this._formBuilder.control<string>('', [Validators.required]),
    description: this._formBuilder.control<string>(''),
    address: this._formBuilder.control<string>('', [Validators.required]),
    images: this._formBuilder.control<File[] | null>([], [Validators.required]),
  });

  constructor() {
    effect(() => {
      const address = this._addressFetched();
      if (address) this.form.patchValue({ address });
    });
  }

  handleMapClick({ coordinate }: MapClickEvent) {
    this._markers.update(() => [{ coordinate }]);
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
      console.error('Form is invalid');
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
