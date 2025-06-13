import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AddressService } from '../../maps/services/address.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { of } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MapComponent } from '../../maps/components/map/map.component';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home-page',
  imports: [
    ReactiveFormsModule,
    MapComponent,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonModule,],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
private _addressService = inject(AddressService);
  private _addressTrigger = signal<string>('');

  private readonly _addressResource = rxResource({
    request: () => this._addressTrigger(),
    loader: ({ request: address }) =>
      address ? this._addressService.geocodeAddress(address) : of(null),
  });

  private _addressCoordinate = computed(() => {
    return this._addressResource.value() || DEFAULT_CENTER;
  });

  private _marker = computed(() => ({
    id: 'address-marker',
    coordinate: this._addressCoordinate(),
    title: 'Address Location',
  }));

  addressInput = new FormControl('');
  mapConfig = computed(() => ({
    center: this._addressCoordinate(),
    enableClick: false,
    markers: [this._marker()],
  }));

  updateAddress() {
    const address = this.addressInput.value || '';
    this._addressTrigger.set(address);
  }

 }
