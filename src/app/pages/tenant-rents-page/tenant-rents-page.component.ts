import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { SimpleRent } from '../../rents/interfaces/simple-rent.interface';
import { RentService } from '../../rents/rents.service';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';

@Component({
  selector: 'app-tenant-rents-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './tenant-rents-page.component.html',
  styleUrl: './tenant-rents-page.component.css',
})
export class TenantRentsPageComponent implements OnInit {
  private _rentsService = inject(RentService);
  private _router = inject(Router);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  rents = signal<SimpleRent[]>([]);
  totalElements = signal(0);

  descriptor: CardDescriptor<SimpleRent> = {
    user: (p) => p.tenantFullName ?? '',
    name: (p) => p.propertyName,
    date: (p) => p.rentDate,
    id: (p) => p.rentId,
    status: (p) => 'CURRENT',
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
      .getTenantRents(this.pageIndex())
      .pipe(
        tap((newRents) => {
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

  private getRent(rentId: string | number | undefined): SimpleRent | undefined {
    return this.rents().find((r) => r.rentId === rentId);
  }
}
