import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MapComponent } from '../../../maps/components/map/map.component';
import { MapCoordinate } from '../../../maps/interfaces/coordinate.interface';
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
  private _addressCoordinate = signal<MapCoordinate>(DEFAULT_CENTER);

  addressInput = new FormControl('');
  mapConfig = computed(() => ({
    center: this._addressCoordinate(),
    enableClick: false,
  }));

  updateAddress() {
    this._addressService
      .geocodeAddress(this.addressInput.value || '')
      .subscribe((coordinate) => {
        if (!coordinate) return;
        this._addressCoordinate.set(coordinate);
      });
  }
}
