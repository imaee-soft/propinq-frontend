import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { tap } from 'rxjs';
import { ProfileChange } from '../../auth/interfaces/user-auth.interface';
import { LargePage } from '../../shared/interfaces/page.interface';
import { UserProfileService } from '../../users/user-profiles.service';

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
};

const STATE_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
};

@Component({
  selector: 'app-profile-changes-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltip,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './profile-changes-page.component.html',
  styleUrls: [
    '../notifications-page/notifications-page.component.css',
    '../../shared/pages/common-entity-page/common-entity-page.component.css',
  ],
})
export class ProfileChangesPageComponent implements OnInit {
  private _userProfileService = inject(UserProfileService);

  pageNumber = signal(0);
  profileChanges = signal<LargePage<ProfileChange> | undefined>(undefined);
  profileChangesList = computed(() => this.profileChanges()?.content || []);
  profileChangesCount = computed(
    () => this.profileChanges()?.totalElements || 0,
  );
  displayedColumns = ['date', 'notifier', 'state', 'role', 'actions'];

  ngOnInit(): void {
    this.loadProfileChanges();
  }

  loadProfileChanges(): void {
    this._userProfileService
      .getProfileChanges(this.pageNumber())
      .pipe(
        tap((profileChanges) => {
          this.profileChanges.set(profileChanges);
        }),
      )
      .subscribe();
  }

  stateName(state: string): string {
    return STATE_LABELS[state] || state;
  }

  roleName(role: string): string {
    return ROLE_LABELS[role] || role;
  }

  openChat(profileChange: ProfileChange) {
    window.open(`https://wa.me/${profileChange.userPhoneNumber}`, '_blank');
  }

  page(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex);
    this.loadProfileChanges();
  }

  goBack(): void {
    window.history.back();
  }
}
