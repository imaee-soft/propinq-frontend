import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocalityResponse } from '../../../localities/interfaces/locality.interface';
import { ProvinceResponse } from '../../../provinces/interfaces/province.interface';
import { FiltersService } from '../../services/filters.service';

const PROPERTY_TYPES = ['Departamentos', 'Casas', 'Todos'];
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
    MatLabel,
    MatTooltipModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSliderModule,
    MatFabButton,
  ],
})
export class FiltersComponent {
  private _filtersService = inject(FiltersService);

  propertyTypes = signal(PROPERTY_TYPES);
  checkFeatures = signal(CHECK_FEATURES);
  roomOptions = signal(ROOM_OPTIONS);
  bathOptions = signal(BATH_OPTIONS);
  poiTypes = signal(POI_TYPES);
  nearTo = signal(NEAR_TO);
  radius = signal(10);
  provinces = computed(() => this._filtersService.provinces());
  localities = computed(() => this._filtersService.localities());

  selectedPropertyType = signal<string>('Todos');
  selectedNearToOption = signal<string | null>(null);

  selectPropertyType(type: string) {
    this.selectedPropertyType.set(type);
    if (type === 'Departamentos') {
      this._filtersService.onSelectDepartmentType();
    } else if (type === 'Casas') {
      this._filtersService.onSelectPropertyType();
    }
  }

  setMinPrice(price: number) {
    this._filtersService.onSelectPriceMin(price);
  }

  setMaxPrice(price: number) {
    this._filtersService.onSelectPriceMax(price);
  }

  // TODO: furniture and expenses
  checkFeature(feature: string, checked: boolean) {
    if (feature === 'pets') {
      this._filtersService.onSelectAllowPets(checked);
    }
  }

  selectRooms(rooms: number) {
    this._filtersService.onSelectRooms(rooms);
  }

  selectBaths(baths: number) {
    this._filtersService.onSelectBathrooms(baths);
  }

  selectProvince(province: ProvinceResponse) {
    this._filtersService.onSelectProvince(province);
  }

  selectLocality(locality: LocalityResponse) {
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
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (value !== null && value !== undefined && value !== '') {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        this.radius.set(numericValue);
      }
    }
  }

  clearFilters() {
    this._filtersService.clearFilters();
  }
}
