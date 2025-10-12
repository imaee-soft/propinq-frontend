import { Component, computed, OnInit, signal } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

const PROPERTY_TYPES = ['Departamentos', 'Casas', 'Todos'];
const CHECK_FEATURES = [
  { label: 'Amueblado', value: 'furnished' },
  { label: 'Mascotas', value: 'pets' },
  { label: 'Expensas', value: 'expenses' },
];
const ROOM_OPTIONS = [1, 2, 3, 4, 5];
const BATH_OPTIONS = [1, 2, 3];
const PROVINCES = ['Buenos Aires', 'Córdoba', 'Santa Fe'];
type Province = (typeof PROVINCES)[number];
const LOCALITIES: Record<Province, string[]> = {
  'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
  Córdoba: ['Córdoba', 'Villa Carlos Paz', 'Río Cuarto'],
  'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela'],
};
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
export class FiltersComponent implements OnInit {
  propertyTypes = signal(PROPERTY_TYPES);
  checkFeatures = signal(CHECK_FEATURES);
  roomOptions = signal(ROOM_OPTIONS);
  bathOptions = signal(BATH_OPTIONS);
  provinces = signal(PROVINCES);
  nearTo = signal(NEAR_TO);
  radius = signal(10);
  localities = computed(() =>
    this.selectedProvince()
      ? LOCALITIES[this.selectedProvince() as Province]
      : []
  );
  poiTypes = signal(POI_TYPES);

  selectedPropertyType = signal<string>('Todos');
  selectedProvince = signal<string | null>(null);
  selectedLocality = signal<string | null>(null);
  selectedNearToOption = signal<string | null>(null);

  ngOnInit(): void {
    console.log('FiltersComponent initialized');
  }

  selectPropertyType(type: string) {
    this.selectedPropertyType.set(type);
  }

  selectProvince(province: string) {
    this.selectedProvince.set(province);
    this.selectedLocality.set(null);
  }

  selectNearToOption(option: string) {
    this.selectedNearToOption.set(option);
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

  clearFilters() {}
}
