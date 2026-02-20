import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { SimpleRent } from '../../rents/interfaces/simple-rent.interface';
import { RentService } from '../../rents/rents.service';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import {
  ChipFilter,
  CommonEntityPageComponent,
} from '../../shared/pages/common-entity-page/common-entity-page.component';

@Component({
  selector: 'app-owner-rents-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './owner-rents-page.component.html',
  styleUrl: './owner-rents-page.component.css',
})
export class OwnerRentsPageComponent {
  private _rentsService = inject(RentService);
  private _router = inject(Router);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  rents = signal<SimpleRent[]>([]);
  totalElements = signal(0);
  isInitialLoading = signal(true);

  rentQueryStatus = signal<'all' | 'active' | 'cancelled' | 'done'>('all');
  chipFilters: ChipFilter[] = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'cancelled', label: 'Cancelados' },
    { id: 'done', label: 'Finalizados' },
  ];
  currentFilter = computed(() =>
    this.chipFilters.find((f) => f.id === this.rentQueryStatus()),
  );
  surnameFilter = signal<string | undefined>(undefined);

  descriptor: CardDescriptor<SimpleRent> = {
    user: (p) => p.tenantFullName ?? '',
    name: (p) => p.propertyName,
    date: (p) => p.rentDate,
    id: (p) => p.rentId,
    status: (p) => p.state,
    coordinates: (p) =>
      p.latitude != null && p.longitude != null
        ? { latitude: p.latitude, longitude: p.longitude }
        : DEFAULT_CENTER,
  };

  ngOnInit(): void {
    this.loadRents();
  }

  loadRents() {
    if (!this.canQuery()) return;
    this._rentsService
      .getOwnerRents(this.pageIndex(), 6, this.surnameFilter())
      .pipe(
        tap((newRents) => {
          this.isInitialLoading.set(false);
          this.rents.set([...this.rents(), ...newRents.content]);
          this.totalElements.set(newRents.totalElements);
          if (newRents.totalElements === this.rents().length)
            this.canQuery.set(false);
        }),
      )
      .subscribe();
  }

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.loadRents();
  };

  primaryAction = (rentId: string | number | undefined) => {
    const rent = this.getRent(rentId);
    if (!rent) return;
    this._router.navigate(['/rent-details', rentId]);
  };

  canExecuteSecondaryAction = (rent: SimpleRent): boolean => {
    return true;
  };

  secondaryAction = (rentId: string | number | undefined) => {
    const rent = this.getRent(rentId);
    if (!rent) return;
    this._router.navigate(['/properties', rent.propertyId]);
  };

  changeText(text: string) {
    this.surnameFilter.set(text);
    this.resetPageAndLoadRents();
  }

  private getRent(rentId: string | number | undefined): SimpleRent | undefined {
    return this.rents().find((r) => r.rentId === rentId);
  }

  private resetPageAndLoadRents() {
    this.pageIndex.set(0);
    this.rents.set([]);
    this.totalElements.set(0);
    this.isInitialLoading.set(true);
    this.canQuery.set(true);
    this.loadRents();
  }
}
