import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { BuildingsService } from '../../buildings/buildings.service';
import { EditBuildingDialogComponent } from '../../buildings/dialogs/edit-building-dialog/edit-building-dialog.component';
import { FavoriteService } from '../../favorites/services/favorite-service';
import { NewPropertyDialogComponent } from '../../properties/dialogs/new-property-dialog/new-property-dialog.component';
import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { ImageSectionComponent } from '../../shared/components/image-section/image-section.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { formatDate } from '../../shared/utilities/date.pipes';

@Component({
  selector: 'app-building-details-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    ImageSectionComponent,
  ],
  templateUrl: './building-details-page.component.html',
  styleUrls: ['./building-details-page.component.css'],
})
export class BuildingDetailsPageComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _buildingsService = inject(BuildingsService);
  private _authService = inject(AuthService);
  private _entityDialogService = inject(EntityDialogService);
  private _favoriteService = inject(FavoriteService);
  private _router = inject(Router);

  building$ = this._buildingsService
    .getBuildingDetails(this._activatedRoute.snapshot.params['buildingId'])
    .pipe(shareReplay(1));

  isOwnerRetrieving$ = this.building$.pipe(
    map((building) => {
      const currentUserId = this._authService.user()?.userId;
      return building.userId === currentUserId;
    }),
  );

  images$ = this.building$.pipe(map((building) => building.imagesURL || []));
  favoriteId$ = this.building$.pipe(map((building) => building.favoriteId));
  deleted$ = this.building$.pipe(map((building) => building.deleted));
  name$ = this.building$.pipe(map((building) => building.name));
  description$ = this.building$.pipe(map((building) => building.description));
  address$ = this.building$.pipe(map((building) => building.address));

  properties$ = this._buildingsService
    .getBuildingProperties(this._activatedRoute.snapshot.params['buildingId'])
    .pipe(shareReplay(1));

  totalProperties$ = this.properties$.pipe(
    map((properties) => properties.length),
  );

  building = toSignal(this.building$);
  favoriteId = computed(() => this.building()?.favoriteId);
  loggedUser = computed(() => this._authService.user());

  goBack() {
    window.history.back();
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
          window.location.reload();
        }
      });
  }

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
      .subscribe(() => {
        window.location.reload();
      });
  }

  markAsFavorite() {
    if (!this.loggedUser() || !this.building()) return;
    this._favoriteService
      .addFavorite({
        userID: this.loggedUser()!.userId,
        buildingID: this.building()?.buildingId,
      })
      .pipe(
        tap((favoriteResponse) => {
          this.building$ = this.building$.pipe(
            map((building) => ({
              ...building,
              favoriteId: favoriteResponse.favoriteID,
            })),
            shareReplay(1),
          );
        }),
      )
      .subscribe();
  }

  unmarkAsFavorite() {
    if (!this.loggedUser() || !this.favoriteId()) return;
    this._favoriteService
      .removeFavorite(this.favoriteId()!)
      .pipe(
        tap(() => {
          this.building$ = this.building$.pipe(
            map((building) => ({
              ...building,
              favoriteId: null,
            })),
            shareReplay(1),
          );
        }),
      )
      .subscribe();
  }

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
  }

  goToProperty(property: PropertyDetails) {
    this._router.navigate(['/properties', property.propertyId]);
  }
}
