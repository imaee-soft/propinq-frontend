import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  Renderer2,
  ResourceStatus,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { NewContactDialogComponent } from '../../contacts/dialogs/new-contact-dialog/new-contact-dialog.component';
import { FavoriteService } from '../../favorites/services/favorite-service';
import { EditPropertyDialogComponent } from '../../properties/dialogs/edit-property-dialog/edit-property-dialog.component';
import { PropertiesService } from '../../properties/properties.service';
import { ImageSectionComponent } from '../../shared/components/image-section/image-section.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    ImageSectionComponent,
  ],
  templateUrl: './property-details-page.component.html',
  styleUrl: './property-details-page.component.css',
})
export class PropertyDetailsPageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _propertiesService = inject(PropertiesService);
  private _favoriteService = inject(FavoriteService);
  private _renderer = inject(Renderer2);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _entityDialogService = inject(EntityDialogService);

  propertyId = toSignal(
    this._route.paramMap.pipe(map((params) => params.get('propertyId'))),
  );

  resourceStatus = computed(() => {
    if (this.propertyDetailsResource.status() === ResourceStatus.Error) {
      return 1;
    }
    if (this.propertyDetailsResource.status() === ResourceStatus.Loading) {
      return 2;
    }
    if (this.propertyDetailsResource.status() === ResourceStatus.Resolved) {
      return 4;
    }
    return 0;
  });

  propertyDetailsResource = rxResource({
    request: this.propertyId,
    defaultValue: null,
    loader: () => {
      const propertyQueried = this.propertyId();
      if (propertyQueried == null) return of(null);
      return this._propertiesService.getPropertyDetails(propertyQueried);
    },
  });

  userLogged = computed(() => this._authService.user());
  isOwnerRetrieving = computed(() => {
    const property = this.propertyDetailsResource.value();
    const user = this.userLogged();
    if (property === null || user === null) return false;
    return property.ownerId === user.userId;
  });

  ngOnInit() {
    this._renderer.setStyle(document.body, 'overflow', 'auto');
  }

  goBack() {
    window.history.back();
  }

  contactOwner() {
    if (!this.userLogged()) {
      this._router.navigate(['/auth/login']);
      return;
    }
    const property = this.propertyDetailsResource.value();
    if (property === null) return;
    this._entityDialogService
      .openNewEntityDialog(NewContactDialogComponent, {
        entity: 'contact',
        panelClass: 'contact-dialog',
        backdropClass: 'dialog-backdrop',
        data: property,
      })
      .subscribe(() => {
        window.location.reload();
      });
  }

  goToContact() {
    const contactId = this.propertyDetailsResource.value()?.contactId;
    if (contactId) {
      this._router.navigate(['/contact-details', contactId]);
    }
  }

  markAsFavorite() {
    const property = this.propertyDetailsResource.value();
    if (property === null || this.userLogged() === null) return;
    this._favoriteService
      .addFavorite({
        userID: this.userLogged()!.userId,
        propertyID: property.propertyId,
      })
      .pipe(
        tap((favorite) => {
          if (!property) return;
          this.propertyDetailsResource.update((current) =>
            current ? { ...current, favoriteId: favorite.favoriteID } : current,
          );
        }),
      )
      .subscribe();
  }

  unmarkAsFavorite() {
    const property = this.propertyDetailsResource.value();
    if (property === null || this.userLogged() === null) return;
    if (property.favoriteId) {
      this._favoriteService
        .removeFavorite(property.favoriteId)
        .subscribe(() => {
          this.propertyDetailsResource.update((current) =>
            current ? { ...current, favoriteId: null } : current,
          );
        });
    }
  }

  update() {
    const property = this.propertyDetailsResource.value();
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
          this.propertyDetailsResource.reload();
        }
      });
  }

  ngOnDestroy() {
    this._renderer.removeStyle(document.body, 'overflow');
  }

  get images(): string[] {
    const resource = this.propertyDetailsResource;
    if (resource.value) {
      return resource.value()?.imagesURL ?? [];
    }
    return [];
  }
}
