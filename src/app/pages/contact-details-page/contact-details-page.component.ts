import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { ContactsService } from '../../contacts/contacts.service';
import { STATUS_MAP, StatusConfig } from '../../contacts/contacts.utils';
import { RejectContactDialogComponent } from '../../contacts/dialogs/reject-contact-dialog/reject-contact-dialog.component';
import { SeeCancellationDialogComponent } from '../../contacts/dialogs/see-cancellation-dialog/see-cancellation-dialog.component';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { ContactActionsDialogComponent } from '../../notifications/dialogs/contact-actions-dialog/contact-actions-dialog.component';
import { PropertiesService } from '../../properties/properties.service';
import { NewRentDialogComponent } from '../../rents/dialogs/new-rent-dialog/new-rent-dialog.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { QueryParamsService } from '../../shared/services/query-params.service';
import { formatDate } from '../../shared/utilities/date.pipes';

@Component({
  selector: 'app-contact-details-page',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MapComponent,
    MatTooltipModule,
  ],
  templateUrl: './contact-details-page.component.html',
  styleUrls: ['./contact-details-page.component.css'],
})
export class ContactDetailsPageComponent {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _contactService = inject(ContactsService);
  private _propertyService = inject(PropertiesService);
  private _entityDialogService = inject(EntityDialogService);
  private _queryParamsService = inject(QueryParamsService);
  private _matDialog = inject(MatDialog);

  contactDetails$ = this._contactService
    .getContactDetails(this._route.snapshot.params['contactId'])
    .pipe(shareReplay(1));

  mapConfig$ = this.contactDetails$.pipe(
    map((contact) => ({
      ...DEFAULT_MAP_CONFIG,
      center: {
        latitude: contact.latitude,
        longitude: contact.longitude,
      },
      markers: [
        {
          type: 'property',
          coordinate: {
            latitude: contact.latitude,
            longitude: contact.longitude,
          },
          icon: { url: '/property.png' },
        },
      ],
    })),
  );

  isOwner$ = this.contactDetails$.pipe(
    map((contact) => contact.isOwnerRetrieving),
  );

  canAnswer$ = this.contactDetails$.pipe(
    map((contact) => contact.status === 'CREATED' && contact.isOwnerRetrieving),
  );

  canRent$ = this.contactDetails$.pipe(
    map(
      (contact) => contact.status === 'ACCEPTED' && contact.isOwnerRetrieving,
    ),
  );

  contactId = () => this._route.snapshot.params['contactId'];

  issuerFullName = toSignal(
    this.contactDetails$.pipe(map((contact) => contact.issuer)),
  );
  contactDate = toSignal(
    this.contactDetails$.pipe(map((contact) => contact.contactDate)),
  );
  cancellationDate = toSignal(
    this.contactDetails$.pipe(map((contact) => contact.cancellationDate)),
  );
  cancellationReason = toSignal(
    this.contactDetails$.pipe(map((contact) => contact.cancellationReason)),
  );
  propertyId = toSignal(
    this.contactDetails$.pipe(map((contact) => contact.propertyId)),
  );

  goBack() {
    window.history.back();
  }

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
  }

  goToProperty() {
    this.contactDetails$.subscribe((contact) => {
      const url = this._router.createUrlTree([
        '/properties',
        contact.propertyId,
      ]);
      window.open(url.toString(), '_blank');
    });
  }

  goToWhatsAppChat() {
    this.contactDetails$.subscribe((contact) => {
      if (contact.isOwnerRetrieving) {
        window.open(`https://wa.me/${contact.issuerPhoneNumber}`, '_blank');
      } else {
        window.open(`https://wa.me/${contact.ownerPhoneNumber}`, '_blank');
      }
    });
  }

  getStatusConfig(status: string): StatusConfig {
    return STATUS_MAP[status];
  }

  seeCancellation() {
    this._matDialog.open(SeeCancellationDialogComponent, {
      panelClass: 'contact-dialog',
      backdropClass: 'dialog-backdrop',
      data: {
        cancellationDate: this.cancellationDate(),
        cancellationReason: this.cancellationReason(),
      },
    });
  }

  answer() {
    this._entityDialogService
      .openActionsDialog(ContactActionsDialogComponent, {
        panelClass: 'contact-dialog',
        entity: 'contact',
        action: 'answer',
        backdropClass: 'dialog-backdrop',
        id: this.contactId(),
        data: {
          contactId: this.contactId(),
          notifierFullName: this.issuerFullName(),
        },
      })
      .subscribe((changed: boolean) => {
        this._queryParamsService.clearQueryParams();
        if (changed) {
          window.location.reload();
        }
      });
  }

  rent() {
    const propertyId = this.propertyId();
    if (!propertyId) return;
    this._propertyService
      .getPropertyDetails(propertyId)
      .subscribe((property) => {
        this._entityDialogService
          .openNewEntityDialog(NewRentDialogComponent, {
            panelClass: 'rent-dialog',
            entity: 'rent',
            backdropClass: 'dialog-backdrop',
            data: {
              contactId: this.contactId(),
              propertyId,
              propertyName: property.title,
              propertyPrice: property.price,
              issuerFullName: this.issuerFullName(),
            },
          })
          .subscribe((rentId: string) => {
            this._queryParamsService.clearQueryParams();
            if (rentId) {
              this._router.navigate(['rent-details', rentId]);
            } else {
              window.location.reload();
            }
          });
      });
  }

  reject() {
    this._entityDialogService
      .openActionsDialog(RejectContactDialogComponent, {
        panelClass: 'contact-dialog',
        entity: 'contact',
        action: 'reject',
        backdropClass: 'dialog-backdrop',
        id: this.contactId(),
        data: {
          contactId: this.contactId(),
          issuerFullName: this.issuerFullName(),
          contactDate: this.contactDate(),
        },
      })
      .subscribe((changed: boolean) => {
        this._queryParamsService.clearQueryParams();
        if (changed) {
          window.location.reload();
        }
      });
  }
}
