import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { tap } from 'rxjs';
import { LocalityResponse } from '../../../localities/interfaces/locality.interface';
import { ParametersService } from '../../../parameters/parameters.service';
import { ProvinceResponse } from '../../../provinces/interfaces/province.interface';
import { FiltersService } from '../../services/filters.service';

const PROPERTY_TYPES = ['Todos', 'Inmuebles', 'Casas'];
const CHECK_FEATURES = [
  { label: 'Amueblado', value: 'furnished' },
  { label: 'Mascotas', value: 'pets' },
  { label: 'Expensas', value: 'expenses' },
];
const ROOM_OPTIONS = [1, 2, 3, 4, 5];
const BATH_OPTIONS = [1, 2, 3];
const NEAR_TO = ['Mi ubicación', 'Punto de interés'];
const POI_TYPES = [
  { value: 'SHOP', label: 'Tienda' },
  { value: 'TOURISM', label: 'Turismo' },
  { value: 'OFFICE', label: 'Oficina' },
  { value: 'EMERGENCY', label: 'Emergencia' },
  { value: 'HEALTHCARE', label: 'Salud' },
  { value: 'PUBLIC_TRANSPORT', label: 'Transporte Público' },
];

@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.css'],
  imports: [
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSliderModule,
    MatFabButton,
  ],
})
export class FiltersComponent implements OnInit {
  private _filtersService = inject(FiltersService);
  private _parametersService = inject(ParametersService);

  propertyTypes = signal(PROPERTY_TYPES);
  minPrice = signal(0);
  maxPrice = signal(999999);
  checkFeatures = signal(CHECK_FEATURES);
  roomOptions = signal(ROOM_OPTIONS);
  bathOptions = signal(BATH_OPTIONS);
  poiTypes = signal(POI_TYPES);
  nearTo = signal(NEAR_TO);
  // Usamos el radius del servicio como fuente de verdad
  radius = computed(() => this._filtersService.radius());
  provinces = computed(() => this._filtersService.provinces());
  localities = computed(() => this._filtersService.localities());

  selectedPropertyType = signal<string>('Todos');
  selectedFurnishing = signal<boolean | null>(null);
  selectedPets = signal<boolean | null>(null);
  selectedExpenses = signal<boolean | null>(null);
  selectedRooms = signal<number | null>(null);
  selectedBathrooms = signal<number | null>(null);
  selectedProvince = signal<ProvinceResponse | null>(null);
  selectedLocality = signal<LocalityResponse | null>(null);
  selectedNearToOption = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMinPrice();
    this.loadMaxPrice();
  }

  loadMinPrice() {
    this._parametersService
      .minPrice()
      .pipe(tap((minPrice) => this.minPrice.set(minPrice)))
      .subscribe();
  }

  loadMaxPrice() {
    this._parametersService
      .maxPrice()
      .pipe(tap((minPrice) => this.maxPrice.set(minPrice)))
      .subscribe();
  }

  selectPropertyType(type: string) {
    this.selectedPropertyType.set(type);
    if (type === 'Inmuebles') {
      this._filtersService.onSelectDepartmentType();
    } else if (type === 'Casas') {
      this._filtersService.onSelectPropertyType();
    } else if (type === 'Todos') {
      this._filtersService.onSelectAllTypes();
    }
  }

  setMinPrice(price: number | string) {
    const n = Number(price);
    this._filtersService.onSelectPriceMin(isNaN(n) ? ('' as any) : n);
  }

  setMaxPrice(price: number | string) {
    const n = Number(price);
    this._filtersService.onSelectPriceMax(isNaN(n) ? ('' as any) : n);
  }

  selectFurnishing(checked: boolean) {
    this.selectedFurnishing.set(checked);
    // this._filtersService.onSelectFurnishing(checked);
  }

  selectPets(checked: boolean) {
    this.selectedPets.set(checked);
    this._filtersService.onSelectAllowPets(checked);
  }

  selectExpenses(checked: boolean) {
    this.selectedExpenses.set(checked);
    // this._filtersService.onSelectExpenses(checked);
  }

  selectRooms(rooms: number) {
    this.selectedRooms.set(rooms);
    this._filtersService.onSelectRooms(rooms);
  }

  selectBaths(baths: number) {
    this.selectedBathrooms.set(baths);
    this._filtersService.onSelectBathrooms(baths);
  }

  selectProvince(province: ProvinceResponse) {
    this.selectedProvince.set(province);
    this._filtersService.onSelectProvince(province);
  }

  selectLocality(locality: LocalityResponse) {
    this.selectedLocality.set(locality);
    this._filtersService.onSelectLocality(locality);
  }

  selectNearToOption(option: string) {
    this.selectedNearToOption.set(option);
    if (option === 'Mi ubicación') {
      this._filtersService.onSelectMyLocation();
    } else if (option === 'Punto de interés') {
      this._filtersService.onSelectPointOfInterestButton();
    }
  }

  selectPointOfInterestType(type: string) {
    this._filtersService.onSelectPointOfInterest(type);
  }

  changeRadius(event: Event) {
    // Delegamos al servicio para actualizar el radius y disparar recursos
    this._filtersService.onSliderChange(event);
  }

  clearFilters() {
    this._filtersService.clearFilters();
    this.selectedPropertyType.set('Todos');
    this.selectedFurnishing.set(null);
    this.selectedPets.set(null);
    this.selectedExpenses.set(null);
    this.selectedRooms.set(null);
    this.selectedBathrooms.set(null);
    this.selectedProvince.set(null);
    this.selectedLocality.set(null);
    this.selectedNearToOption.set(null);
  }
}
