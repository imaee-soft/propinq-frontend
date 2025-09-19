import { Component, Input, Output, EventEmitter, signal, input, output, inject, effect } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-navbar-filters',
  templateUrl: './navbar-filters.component.html',
  styleUrls: ['./navbar-filters.component.css'],
  imports: [MatInputModule, MatSelectModule, MatOptionModule, MatCheckbox, MatSliderModule, MatIconModule, FormsModule, CommonModule],
})
export class NavbarFiltersComponent {
  private _navbarService = inject(NavbarService);

  sliderValue = signal(20);
  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (value !== null && value !== undefined && value !== '') {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        this.filterNearAreaKm.set(numericValue);
      }
    }
  }

  filterNearType = this._navbarService.filterNearType;
  filterNearAreaKm = this._navbarService.filterNearAreaKm;
  filterAddress = this._navbarService.filterAddress;
  filterProvince = this._navbarService.filterProvince;
  filterLocality = this._navbarService.filterLocality;
  filterPriceMin = this._navbarService.filterPriceMin;
  filterPriceMax = this._navbarService.filterPriceMax;
  
  filterTypeCasa = this._navbarService.filterTypeCasa;
  filterTypeDepto = this._navbarService.filterTypeDepto;
  filterAllowPets = this._navbarService.filterAllowPets;
  filterRooms = this._navbarService.filterRooms;
  filterBathrooms = this._navbarService.filterBathrooms;
  filterAreaMin = this._navbarService.filterAreaMin;
  filterAreaMax = this._navbarService.filterAreaMax;



  clearFilters() { this._navbarService.clearAllFilters(); }

}

