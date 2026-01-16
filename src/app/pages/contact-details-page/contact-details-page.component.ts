import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { STATUS_MAP, StatusConfig } from '../../contacts/contacts.utils';
import { ContactDetails } from '../../contacts/interfaces/contact-details.interface';
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
  readonly contact: ContactDetails = {
    contactId: '16576463-1474-4669-802f-7d17356d999b',
    propertyId: 'aaaabbbb-cccc-dddd-eeee-ffff00000008',
    contactDate: new Date('2026-01-13T23:26:14.71925'),
    owner: 'Martín Crosetto',
    issuer: 'Ezequiel Sosa',
    propertyAddress: 'Bv. España 1514, Villa María, Córdoba, Casa 8',
    status: 'REJECTED',
    latitude: -32.409,
    longitude: -63.2421,
    ownerPhoneNumber: '+54 9 353 1234567',
    message:
      'Hola, estoy interesado en la propiedad. ¿Podríamos coordinar una visita este fin de semana?',
    answerDate: new Date('2026-01-14T10:15:00'),
    answer:
      'Gracias por su interés. Lamentablemente, la propiedad ya ha sido vendida.',
  };

  readonly mapConfig = {
    ...DEFAULT_MAP_CONFIG,
    center: {
      latitude: this.contact.latitude,
      longitude: this.contact.longitude,
    },
    markers: [
      {
        type: 'property',
        coordinate: {
          latitude: this.contact.latitude,
          longitude: this.contact.longitude,
        },
        icon: { url: '/location.png' },
      },
    ],
  };

  formatDateWrapper(date: Date | undefined): string {
    return formatDate(date);
  }

  getStatusConfig(status: string): StatusConfig | null {
    return STATUS_MAP[status] ?? null;
  }
}
