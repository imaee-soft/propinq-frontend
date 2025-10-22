import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { LocalityResponse } from '../../../localities/interfaces/locality.interface';
import { ProvinceResponse } from '../../../provinces/interfaces/province.interface';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-navbar-filters',
  templateUrl: './navbar-filters.component.html',
  styleUrls: ['./navbar-filters.component.css'],
  imports: [
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSliderModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatCheckbox,
  ],
})
export class NavbarFiltersComponent {
  private _navbarService = inject(NavbarService);

  clearFilters() {
    // this._navbarService.clearFilters();
  }

  onSelectMyLocation() {
    // this._navbarService.onSelectMyLocation();
  }
  onSelectPoint() {
    // this._navbarService.onSelectPoint();
  }
  onSelectPointOfInterestButton() {
    // this._navbarService.onSelectPointOfInterestButton();
  }

  onSelectPointOfInterest(event: string) {
    // this._navbarService.onSelectPointOfInterest(event);
  }

  onSliderChange(event: Event) {
    // this._navbarService.onSliderChange(event);
  }

  onSelectProvince(event: ProvinceResponse) {
    // this._navbarService.onSelectProvince(event);
  }

  onSelectLocality(event: LocalityResponse) {
    // this._navbarService.onSelectLocality(event);
  }

  onSelectPriceMin(event: number) {
    // this._navbarService.onSelectPriceMin(event);
  }

  onSelectPriceMax(event: number) {
    // this._navbarService.onSelectPriceMax(event);
  }

  onSelectPropertyType() {
    // this._navbarService.onSelectPropertyType();
  }

  onSelectDepartmentType() {
    // this._navbarService.onSelectDepartmentType();
  }

  onSelectAllowPets(event: boolean) {
    // this._navbarService.onSelectAllowPets(event);
  }

  onSelectRooms(event: number) {
    // this._navbarService.onSelectRooms(event);
  }

  onSelectBathrooms(event: number) {
    // this._navbarService.onSelectBathrooms(event);
  }

  onSelectAreaMin(event: number) {
    // this._navbarService.onSelectAreaMin(event);
  }

  onSelectAreaMax(event: number) {
    // this._navbarService.onSelectAreaMax(event);
  }
}
