import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ContactsService } from '../../contacts/contacts.service';
import { ContactDetails } from '../../contacts/interfaces/contact-details.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import {
  ChipFilter,
  CommonEntityPageComponent,
} from '../../shared/pages/common-entity-page/common-entity-page.component';

import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ContactActionsDialogComponent } from '../../notifications/dialogs/contact-actions-dialog/contact-actions-dialog.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { QueryParamsService } from '../../shared/services/query-params.service';

@Component({
  selector: 'app-owner-contacts-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './owner-contacts-page.component.html',
  styleUrls: ['./owner-contacts-page.component.css'],
})
export class OwnerContactsPageComponent implements OnInit {
  private _contactsService = inject(ContactsService);
  private _router = inject(Router);
  private _queryParamsService = inject(QueryParamsService);
  private _entityDialogService = inject(EntityDialogService);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  contacts = signal<ContactDetails[]>([]);
  totalElements = signal(0);
  isInitialLoading = signal(true);

  contactQueryStatus = signal<
    'all' | 'created' | 'rejected' | 'accepted' | 'unsettled' | 'rented'
  >('all');
  chipFilters: ChipFilter[] = [
    { id: 'all', label: 'Todas' },
    { id: 'created', label: 'Creadas' },
    { id: 'rejected', label: 'Rechazadas' },
    { id: 'accepted', label: 'En curso' },
    { id: 'unsettled', label: 'No concretadas' },
    { id: 'rented', label: 'Alquiladas' },
  ];
  currentFilter = computed(() =>
    this.chipFilters.find((f) => f.id === this.contactQueryStatus()),
  );
  surnameFilter = signal<string | undefined>(undefined);

  descriptor: CardDescriptor<ContactDetails> = {
    user: (p) => p.issuer ?? '',
    name: (p) => p.propertyAddress,
    date: (p) => p.contactDate,
    id: (p) => p.contactId,
    status: (p) => p.status,
    coordinates: (p) =>
      p.latitude != null && p.longitude != null
        ? { latitude: p.latitude, longitude: p.longitude }
        : DEFAULT_CENTER,
  };

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    if (!this.canQuery()) return;
    this._contactsService
      .getOwnerContactsDetails(
        this.pageIndex(),
        6,
        this.surnameFilter(),
        this.contactQueryStatus(),
      )
      .pipe(
        tap((newContacts) => {
          this.isInitialLoading.set(false);
          this.contacts.set([...this.contacts(), ...newContacts.content]);
          this.totalElements.set(newContacts.totalElements);
          if (newContacts.totalElements === this.contacts().length)
            this.canQuery.set(false);
        }),
      )
      .subscribe();
  }

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.loadContacts();
  };

  changeContactState(type: ChipFilter) {
    this.contactQueryStatus.set(
      type.id as
        | 'all'
        | 'created'
        | 'rejected'
        | 'accepted'
        | 'unsettled'
        | 'rented',
    );
    this.resetPageAndLoadContacts();
  }

  changeText(text: string) {
    this.surnameFilter.set(text);
    this.resetPageAndLoadContacts();
  }

  primaryAction = (contactId: string | number | undefined) => {
    const contact = this.getContact(contactId);
    if (!contact) return;
    this._router.navigate(['/contact-details', contact.contactId]);
  };

  canExecuteSecondaryAction = (contact: ContactDetails): boolean => {
    return true;
  };

  secondaryAction = (contactId: string | number | undefined) => {
    const contact = this.getContact(contactId);
    if (!contact) return;
    this._router.navigate(['/properties', contact.propertyId]);
  };

  canExecuteThirdAction = (contact: ContactDetails): boolean => {
    return contact.status === 'CREATED';
  };

  thirdActionLabel = (contactId: string | number | undefined): string => {
    return 'Responder';
  };

  thirdAction = (contactId: string | number | undefined) => {
    const contact = this.getContact(contactId);
    if (!contact) return;
    this.openAnswerDialog(contact);
  };

  openAnswerDialog = (contact: ContactDetails) => {
    this._entityDialogService
      .openActionsDialog(ContactActionsDialogComponent, {
        panelClass: 'contact-dialog',
        entity: 'contact',
        action: 'answer',
        backdropClass: 'dialog-backdrop',
        id: contact.contactId,
        data: {
          contactId: contact.contactId,
          notifierFullName: contact.issuer,
        },
      })
      .subscribe((changed: boolean) => {
        this._queryParamsService.clearQueryParams();
        if (changed) {
          this.resetPage();
          this.loadContacts();
        }
      });
  };

  private getContact(contactId: string | number | undefined) {
    return this.contacts().find((c) => c.contactId === contactId);
  }

  private resetPageAndLoadContacts() {
    this.pageIndex.set(0);
    this.contacts.set([]);
    this.totalElements.set(0);
    this.isInitialLoading.set(true);
    this.canQuery.set(true);
    this.loadContacts();
  }

  private resetPage() {
    this.contacts.set([]);
    this.totalElements.set(0);
    this.pageIndex.set(0);
    this.canQuery.set(true);
  }
}
