import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { NewContactDialogComponent } from '../../../contacts/dialogs/new-contact-dialog/new-contact-dialog.component';
import { FavoriteResponse } from '../../../favorites/interfaces/favorite-interface';
import { FavoriteService } from '../../../favorites/services/favorite-service';
import { EditPropertyDialogComponent } from '../../../properties/dialogs/edit-property-dialog/edit-property-dialog.component';
import { PropertyDetails } from '../../../properties/interfaces/property-details.interface';
import { EntityDialogService } from '../../services/entity-dialog.service';
import { ImageSectionComponent } from '../image-section/image-section.component';

@Component({
  selector: 'app-home-property-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    CommonModule,
    MatTooltipModule,
    ImageSectionComponent,
  ],
  templateUrl: './home-property-card.component.html',
  styleUrls: [
    './home-property-card.component.css',
    '../../../pages/home-page/home-page.component.css',
  ],
})
export class HomePropertyCardComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _entityDialogService = inject(EntityDialogService);
  private _favoriteService = inject(FavoriteService);

  property = input<PropertyDetails>();
  closed = output<void>();
  markedAsFavorite = output<FavoriteResponse>();
  unmarkedAsFavorite = output<void>();
  compared = output<PropertyDetails>();

  loggedUser = computed(() => this._authService.user());
  isOwnerRetrieving = computed(
    () =>
      this.loggedUser() !== null &&
      this.property() !== null &&
      this.loggedUser()!.userId === this.property()!.ownerId,
  );
  favoriteId = computed(() => this.property()?.favoriteId);

  contactOwner() {
    if (!this.loggedUser()) {
      this._router.navigate(['/auth/login']);
      return;
    }
    if (this.property() === null) return;
    this._entityDialogService
      .openNewEntityDialog(NewContactDialogComponent, {
        entity: 'contact',
        panelClass: 'contact-dialog',
        backdropClass: 'dialog-backdrop',
        data: this.property(),
      })
      .subscribe(() => {
        this.closed.emit();
      });
  }

  update() {
    const property = this.property();
    if (!property) return;
    this._entityDialogService
      .openEditEntityDialog(EditPropertyDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'property',
        id: property.propertyId,
        backdropClass: 'dialog-backdrop',
        width: '900px',
        data: { property },
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.closed.emit();
        }
      });
  }

  markAsFavorite() {
    if (this.property() === null) return;
    this._favoriteService
      .addFavorite({
        userID: this.loggedUser()!.userId,
        propertyID: this.property()!.propertyId,
      })
      .pipe(
        tap((favorite) => {
          this.markedAsFavorite.emit(favorite);
        }),
      )
      .subscribe();
  }

  unmarkAsFavorite() {
    if (this.property() === null) return;
    this.unmarkedAsFavorite.emit();
  }

  goToContact() {
    const contactId = this.property()?.contactId;
    if (contactId) {
      this._router.navigate(['/contact-details', contactId]);
    }
  }

  goToPropertyDetails() {
    if (this.property() === null) return;
    this._router.navigate(['/properties', this.property()!.propertyId]);
  }
}
