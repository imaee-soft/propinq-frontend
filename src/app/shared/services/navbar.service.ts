import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AuthStatus } from '../../auth/enums/auth-status.enum';
import { Role } from '../../auth/enums/role.enum';
import { NavElement } from '../interfaces/nav-element.interface';
import { OWNER_NAVBAR_ITEMS } from '../utilities/owner.config';
import { TENANT_NAVBAR_ITEMS } from '../utilities/tenant.config';
import { UNLOGGED_NAVBAR_ITEMS } from '../utilities/unlogged.config';
import { DialogStateService } from './dialog-state.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AddressService } from '../../maps/services/address.service';
import { MapCoordinate } from '../../maps/interfaces/map-coordinate.interface';
import { of } from 'rxjs';
import { BuildingsService } from '../../buildings/buildings.service';
import { PropertiesService } from '../../properties/properties.service';

const NAVBAR_ITEMS: Record<string, NavElement[]> = {
  unlogged: UNLOGGED_NAVBAR_ITEMS,
  tenant_logged: TENANT_NAVBAR_ITEMS,
  owner_logged: OWNER_NAVBAR_ITEMS,
};

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private _authService = inject(AuthService);
  private _dialogStateService = inject(DialogStateService);
  private _filtersOpen = signal(false);
  private readonly _addressService = inject(AddressService);


  config = computed((): NavElement[] => {
    const status = this._authService.status();
    const user = this._authService.user();
    return NAVBAR_ITEMS[
      status === AuthStatus.AUTHENTICATED
        ? user?.role === Role.OWNER
          ? 'owner_logged'
          : 'tenant_logged'
        : 'unlogged'
    ];
  });

  disabled = computed(() => this._dialogStateService.isDialogOpen());
  userLogged = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED
  );
  username = computed(() => this._authService.user()?.
username);

  handleLogin() {
    this._authService.logout();
  }

  showFilters = computed(() =>
    this._authService.status() === AuthStatus.AUTHENTICATED && this._filtersOpen()
  );

  filtersOpen = computed(() => this._filtersOpen());

  toggleFilters(): void {
    this._filtersOpen.set(!this._filtersOpen());
  }

  openFilters(): void {
    this._filtersOpen.set(true);
  }

  closeFilters(): void {
    this._filtersOpen.set(false);
  }


  private _addressFromMap = signal<string>('');
  public addressFromMap = computed(() => this._addressFromMap());

  private _coordinate = signal<MapCoordinate | null>(null);

  private _decodeAddressResource = rxResource({
    request: () => this._coordinate(),
    loader: ({ request: coordinate }) =>
      coordinate ? this._addressService.decodeAddress(coordinate) : of(null),
  });

  constructor() {
    effect(() => {
      const address = this._decodeAddressResource.value();
      if (address) this._addressFromMap.set(address);
    });
  }

  setAddressMarker(coordinate: MapCoordinate) {
    this._coordinate.set(coordinate);
  }

  clearAddressFromMap() {
    this._addressFromMap.set('');
    this._coordinate.set(null);
  }


  filterNearType = signal<string>('MY_LOCATION');
  filterNearAreaKm = signal<number>(20);
  filterAddress = signal<string>('');
  filterProvince = signal<string | null>(null);
  filterLocality = signal<string | null>(null);

  filterPriceMin = signal<number | null>(null);
  filterPriceMax = signal<number | null>(null);

  filterTypeCasa = signal<boolean>(false);
  filterTypeDepto = signal<boolean>(false);
  filterAllowPets = signal<boolean>(false);
  filterRooms = signal<number | null>(null);
  filterBathrooms = signal<number | null>(null);
  filterAreaMin = signal<number | null>(null);
  filterAreaMax = signal<number | null>(null);

  myLocationCoordinate = signal<MapCoordinate | null>(null);

  buildingsService = inject(BuildingsService);
  propertiesService = inject(PropertiesService);

  filteredBuildings = signal<any[]>([]);
  filteredProperties = signal<any[]>([]);

  clearFilters() {
    this.filterNearType.set('MY_LOCATION');
    this.filterNearAreaKm.set(20);
    this.filterAddress.set('');
    this.filterProvince.set(null);
    this.filterLocality.set(null);
    this.filterPriceMin.set(null);
    this.filterPriceMax.set(null);
    this.filterTypeCasa.set(false);
    this.filterTypeDepto.set(false);
    this.filterAllowPets.set(false);
    this.filterRooms.set(null);
    this.filterBathrooms.set(null);
    this.filterAreaMin.set(null);
    this.filterAreaMax.set(null);
    this.applyFilters();
  }

  setMyLocation(coordinate: MapCoordinate) {
    this.myLocationCoordinate.set(coordinate);
    this.filterNearType.set('MY_LOCATION');
    this.applyFilters();
  }


}
