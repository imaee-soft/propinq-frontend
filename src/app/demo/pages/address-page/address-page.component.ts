import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { of } from 'rxjs';
import { MapComponent } from '../../../maps/components/map/map.component';
import { AddressService } from '../../../maps/services/address.service';
import { DEFAULT_CENTER } from '../../../maps/utils/constants';

@Component({
  selector: 'app-address-page',
  imports: [
    ReactiveFormsModule,
    MapComponent,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonModule,
  ],
  templateUrl: './address-page.component.html',
  styleUrls: ['./address-page.component.css'],
})
export class AddressPageComponent {
  private _addressService = inject(AddressService);
  private _addressTrigger = signal<string>('');

  private readonly _addressResource = rxResource({
    request: () => this._addressTrigger(),
    loader: ({ request: address }) => {
      if (!address) return of(null);
      return this._addressService.geocodeAddress(address);
    },
  });

  private _addressCoordinate = computed(() => {
    return this._addressResource.value() || DEFAULT_CENTER;
  });

  addressInput = new FormControl('');
  mapConfig = computed(() => ({
    center: this._addressCoordinate(),
    enableClick: false,
  }));

  updateAddress() {
    console.log('Updating address with:', this.addressInput.value);
    const address = this.addressInput.value || '';
    this._addressTrigger.set(address);
  }
}
