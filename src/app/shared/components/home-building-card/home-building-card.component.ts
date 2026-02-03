import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { EditBuildingDialogComponent } from '../../../buildings/dialogs/edit-building-dialog/edit-building-dialog.component';
import { BuildingDetails } from '../../../buildings/interfaces/building-details.interface';
import { FavoriteResponse } from '../../../favorites/interfaces/favorite-interface';
import { FavoriteService } from '../../../favorites/services/favorite-service';
import { NewPropertyDialogComponent } from '../../../properties/dialogs/new-property-dialog/new-property-dialog.component';
import { EntityDialogService } from '../../services/entity-dialog.service';
import { ImageSectionComponent } from '../image-section/image-section.component';

@Component({
  selector: 'app-home-building-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    ImageSectionComponent,
  ],
  templateUrl: './home-building-card.component.html',
  styleUrls: [
    './home-building-card.component.css',
    '../home-property-card/home-property-card.component.css',
  ],
})
export class HomeBuildingCardComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _favoriteService = inject(FavoriteService);
  private _entityDialogService = inject(EntityDialogService);

  building = input<BuildingDetails>();
  close = output<void>();
  markedAsFavorite = output<FavoriteResponse>();
  unmarkedAsFavorite = output<void>();

  loggedUser = computed(() => this._authService.user());
  favoriteId = computed(() => this.building()?.favoriteId);
  isOwnerRetrieving = computed(
    () =>
      this.loggedUser() !== null &&
      this.building() !== null &&
      this.loggedUser()!.userId === this.building()!.userId,
  );

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
}
