import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ContactsService } from '../../contacts/contacts.service';
import { ContactDetails } from '../../contacts/interfaces/contact-details.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { Page } from '../../shared/interfaces/page.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';

@Component({
  selector: 'app-tenant-contacts-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './tenant-contacts-page.component.html',
  styleUrl: './tenant-contacts-page.component.css',
})
export class TenantContactsPageComponent {
  private _contactsService = inject(ContactsService);

  hasToQuery = signal<boolean>(true);
  pageIndex = signal(0);

  contactsDetailsResource = rxResource({
    loader: () => {
      if (this.hasToQuery()) {
        return this._contactsService.getContactsDetails(this.pageIndex());
      }
      return of(null);
    },
  });

  readonly page = computed<Page<ContactDetails> | null>(() => {
    const value = this.contactsDetailsResource.value();
    if (!value) return null;

    return {
      content: value.content,
      total: value.totalElements,
    };
  });

  totalElements = computed<number>(
    () => this.contactsDetailsResource.value()?.totalElements || 0
  );

  descriptor: CardDescriptor<ContactDetails> = {
    user: (p) => p.owner ?? '',
    name: (p) => p.propertyAddress,
    date: (p) => new Date(),
    id: (p) => p.contactId,
    status: (p) => p.status,
    coordinates: (p) =>
      p.latitude != null && p.longitude != null
        ? { latitude: p.latitude, longitude: p.longitude }
        : DEFAULT_CENTER,
    secondaryActionLabel: (p) => 'Eliminar',
  };

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.contactsDetailsResource.reload();
  };

  delete = (contactId: string | number | undefined) => {
    const contact = this.contactsDetailsResource
      .value()
      ?.content.find((c) => c.contactId === contactId);
    if (!contact) return;
    this._contactsService.deleteContact(contact.contactId).subscribe(() => {
      this.contactsDetailsResource.reload();
    });
  };
}
