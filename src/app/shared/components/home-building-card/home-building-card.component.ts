import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/enums/auth-status.enum';
import { EditBuildingDialogComponent } from '../../../buildings/dialogs/edit-building-dialog/edit-building-dialog.component';
import { BuildingDetails } from '../../../buildings/interfaces/building-details.interface';
import { FavoriteResponse } from '../../../favorites/interfaces/favorite-interface';
import { FavoriteService } from '../../../favorites/services/favorite-service';
import { NewPropertyDialogComponent } from '../../../properties/dialogs/new-property-dialog/new-property-dialog.component';
import { PropertyDetails } from '../../../properties/interfaces/property-details.interface';
import { EntityDialogService } from '../../services/entity-dialog.service';
import { ImageSectionComponent } from '../image-section/image-section.component';

@Component({
  selector: 'app-home-building-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    ImageSectionComponent,
  ],
  templateUrl: './home-building-card.component.html',
  styleUrls: [
    './home-building-card.component.css',
    // Clases del drawer previo al refactor: building-card, scrolled, property-grid, etc.
    '../../../pages/home-page/home-page.component.css',
  ],
})
export class HomeBuildingCardComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _favoriteService = inject(FavoriteService);
  private _entityDialogService = inject(EntityDialogService);

  building = input<BuildingDetails>();
  properties = input<PropertyDetails[] | null>(null);
  close = output<void>();
  markedAsFavorite = output<FavoriteResponse>();
  unmarkedAsFavorite = output<void>();
  compared = output<PropertyDetails>();

  loggedUser = computed(() => this._authService.user());
  favoriteId = computed(() => this.building()?.favoriteId);
  isAuthenticated = computed(
    () => this._authService.status() === AuthStatus.AUTHENTICATED,
  );
  isOwnerRetrieving = computed(
    () =>
      this.loggedUser() !== null &&
      this.building() !== null &&
      this.loggedUser()!.userId === this.building()!.userId,
  );
  propertiesList = computed(() => this.properties() ?? []);

  newProperty() {
    this._entityDialogService
      .openNewEntityDialog(NewPropertyDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'property',
        backdropClass: 'dialog-backdrop',
        data: {
          buildingId: this.building()?.buildingId ?? '',
          buildingName: this.building()?.name ?? '',
        },
      })
      .subscribe();
  }

  update(): void {
    const building = this.building();
    if (!building) return;
    this._entityDialogService
      .openEditEntityDialog(EditBuildingDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'building',
        backdropClass: 'dialog-backdrop',
        id: building.buildingId,
        width: '900px',
        data: { building },
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.close.emit();
        }
      });
  }

  markAsFavorite() {
    if (!this.building() || !this.loggedUser()) return;
    this._favoriteService
      .addFavorite({
        userID: this.loggedUser()!.userId,
        buildingID: this.building()!.buildingId,
      })
      .pipe(
        tap((favoriteResponse) => {
          this.markedAsFavorite.emit(favoriteResponse);
        }),
      )
      .subscribe();
  }

  unmarkAsFavorite() {
    if (!this.building() || !this.loggedUser()) return;
    if (!this.building()!.favoriteId) return;
    this._favoriteService
      .removeFavorite(this.building()!.favoriteId!)
      .pipe(
        tap(() => {
          this.unmarkedAsFavorite.emit();
        }),
      )
      .subscribe();
  }

  goToBuildingDetails() {
    this._router.navigate(['/buildings', this.building()?.buildingId]);
  }

  goToProperty(propertyId: string) {
    if (!propertyId) return;
    this._router.navigate(['/properties', propertyId]);
  }

  addToComparativeList(property: PropertyDetails) {
    this.compared.emit(property);
  }

  isPropertyFavorite(property: PropertyDetails): boolean {
    return !!property.favoriteId;
  }

  togglePropertyFavorite(property: PropertyDetails) {
    const userId = this.loggedUser()?.userId;
    if (!userId || !property.propertyId) return;

    if (property.favoriteId) {
      const favoriteId = property.favoriteId;
      property.favoriteId = null;
      this._favoriteService.removeFavorite(favoriteId).subscribe({
        error: () => {
          property.favoriteId = favoriteId;
        },
      });
      return;
    }

    this._favoriteService
      .addFavorite({
        userID: userId,
        propertyID: property.propertyId,
      })
      .subscribe({
        next: (favorite) => {
          property.favoriteId = favorite.favoriteID;
        },
      });
  }
}
