import { Component, Input, Output, EventEmitter, signal, input, output, inject, effect, computed } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../services/navbar.service';
import { ProvinceResponse } from '../../../provinces/interfaces/province.interface';
import { LocalityResponse } from '../../../localities/interfaces/locality.interface';

@Component({
  selector: 'app-navbar-filters',
  templateUrl: './navbar-filters.component.html',
  styleUrls: ['./navbar-filters.component.css'],
  imports: [MatInputModule, MatSelectModule, MatOptionModule, MatCheckbox, MatSliderModule, MatIconModule, FormsModule, CommonModule],
})
export class NavbarFiltersComponent {
  private _navbarService = inject(NavbarService);

  filterNearMyLocation = computed(() => this._navbarService.filterNearMyLocation());
  filterNearPoint = computed(() => this._navbarService.filterNearPoint());
  isLocationPointSelected = computed(() => this._navbarService.isLocationPointSelected());
  filterNearPointOfInterest = computed(() => this._navbarService.filterNearPointOfInterest());
  selectedPointOfInterest = computed(() => this._navbarService.selectedPointOfInterest());
  radius = computed(() => this._navbarService.radius());

  filterProvince = computed(() => this._navbarService.filterProvince());
  filterLocality = computed(() => this._navbarService.filterLocality());

  filterPriceMin = computed(() => this._navbarService.filterPriceMin());
  filterPriceMax = computed(() => this._navbarService.filterPriceMax());

  filterPropertyType = computed(() => this._navbarService.filterPropertyType());
  filterDepartmentType = computed(() => this._navbarService.filterDepartmentType());
  filterAllowPets = computed(() => this._navbarService.filterAllowPets());
  filterRooms = computed(() => this._navbarService.filterRooms());
  filterBathrooms = computed(() => this._navbarService.filterBathrooms());
  filterAreaMin = computed(() => this._navbarService.filterAreaMin());
  filterAreaMax = computed(() => this._navbarService.filterAreaMax());

  provinces = computed(() => this._navbarService.provinces());
  localities = computed(() => this._navbarService.localities());

  clearFilters() { this._navbarService.clearFilters(); }


  onSelectMyLocation() {
   this._navbarService.onSelectMyLocation();
  }
  onSelectPoint() {
    this._navbarService.onSelectPoint();
  }
  onSelectPointOfInterestButton() {
    this._navbarService.onSelectPointOfInterestButton();
  }

  onSelectPointOfInterest(event: string) {
    this._navbarService.onSelectPointOfInterest(event);}

  onSliderChange(event: Event) {
    this._navbarService.onSliderChange(event);
  }


  onSelectProvince(event: ProvinceResponse) {
   this._navbarService.onSelectProvince(event);
  }

  onSelectLocality(event: LocalityResponse) {
    this._navbarService.onSelectLocality(event);
  }



  onSelectPriceMin(event: number) {
    this._navbarService.onSelectPriceMin(event);
  }

  onSelectPriceMax(event: number) {
    this._navbarService.onSelectPriceMax(event);
  }

  onSelectPropertyType() {
    this._navbarService.onSelectPropertyType();
  }

  onSelectDepartmentType() {
    this._navbarService.onSelectDepartmentType();
  }

  onSelectAllowPets(event: boolean) {
    this._navbarService.onSelectAllowPets(event);
  }

  onSelectRooms(event: number) {
    this._navbarService.onSelectRooms(event);
  }

  onSelectBathrooms(event: number) {
    this._navbarService.onSelectBathrooms(event);
  }

  onSelectAreaMin(event: number) {
    this._navbarService.onSelectAreaMin(event);
  }

  onSelectAreaMax(event: number) {
    this._navbarService.onSelectAreaMax(event);
  }

}
