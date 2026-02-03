import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { ContactsService } from '../../contacts/contacts.service';
import { STATUS_MAP, StatusConfig } from '../../contacts/contacts.utils';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { ContactActionsDialogComponent } from '../../notifications/dialogs/contact-actions-dialog/contact-actions-dialog.component';
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
  private _entityDialogService = inject(EntityDialogService);
  private _queryParamsService = inject(QueryParamsService);

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
          icon: { url: '/location.png' },
        },
      ],
    })),
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

  goBack() {
    window.history.back();
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

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
  }

  getStatusConfig(status: string): StatusConfig {
    return STATUS_MAP[status];
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
}
