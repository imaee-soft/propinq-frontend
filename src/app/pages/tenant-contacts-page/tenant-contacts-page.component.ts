import { Component, inject, OnInit, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ContactsService } from '../../contacts/contacts.service';
import { ContactDetails } from '../../contacts/interfaces/contact-details.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-tenant-contacts-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './tenant-contacts-page.component.html',
  styleUrls: ['./tenant-contacts-page.component.css'],
})
export class TenantContactsPageComponent implements OnInit {
  private _contactsService = inject(ContactsService);
  private _notificationService = inject(NotificationService);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  contacts = signal<ContactDetails[]>([]);
  totalElements = signal(0);

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

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    if (!this.canQuery()) return;
    this._contactsService
      .getContactsDetails(this.pageIndex())
      .pipe(
        tap((newContacts) => {
          this.contacts.set([...this.contacts(), ...newContacts.content]);
          this.totalElements.set(newContacts.totalElements);
          if (newContacts.totalElements === this.contacts().length)
            this.canQuery.set(false);
        })
      )
      .subscribe();
  }

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.loadContacts();
  };

  delete = (contactId: string | number | undefined) => {
    const contact = this.contacts().find((c) => c.contactId === contactId);
    if (!contact) return;
    this._contactsService.deleteContact(contact.contactId).subscribe({
      next: () => {
        this._notificationService.success(
          'La solicitud de contacto fue eliminada correctamente'
        );
        this.resetPage();
        this.loadContacts();
      },
      error: () => {
        this._notificationService.error(
          'Ocurrió un error al eliminar el contacto'
        );
      },
    });
  };

  private resetPage() {
    this.contacts.set([]);
    this.totalElements.set(0);
    this.pageIndex.set(0);
    this.canQuery.set(true);
  }
}
