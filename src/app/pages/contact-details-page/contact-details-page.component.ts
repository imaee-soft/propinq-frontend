import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { ContactsService } from '../../contacts/contacts.service';
import { STATUS_MAP, StatusConfig } from '../../contacts/contacts.utils';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { formatDate } from '../../shared/utilities/date.pipes';

@Component({
  selector: 'app-contact-details-page',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MapComponent,
  ],
  templateUrl: './contact-details-page.component.html',
  styleUrls: ['./contact-details-page.component.css'],
})
export class ContactDetailsPageComponent {
  private _route = inject(ActivatedRoute);
  private _contactService = inject(ContactsService);

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
    }))
  );

  goBack() {
    window.history.back();
  }

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
  }

  getStatusConfig(status: string): StatusConfig {
    return STATUS_MAP[status];
  }
}
