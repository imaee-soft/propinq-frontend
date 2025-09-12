import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { PhonePipe } from '../../../shared/pipes/phone-number.pipe';
import { NotificationService } from '../../../shared/services/notification.service';
import { DynamicInputComponent } from '../../components/dynamic-input.component';
import { UpdateUserRequest } from '../../interfaces/update-user-request';
import { UserResponse } from '../../interfaces/user-response';
import { UPDATED_USER } from '../../users.constants';
import { UsersService } from '../../users.service';
import { UserComparisonAttribute } from '../../interfaces/user-comparison-attribute';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
  imports: [MatLabel, MatCardModule, MatIcon, DynamicInputComponent, PhonePipe, MatCheckboxModule, FormsModule],
})
export class UserAccountComponent {
  private _usersService = inject(UsersService);
  private _authService = inject(AuthService);
  private _notificationService = inject(NotificationService);
  public comparisonAttributes = signal<UserComparisonAttribute[]>([
    { label: 'Precio', key: 'price', enabled: true},
    { label: 'Superficie (m²)', key: 'area', enabled: true},
    { label: 'Ambientes', key: 'bedrooms', enabled: true},
    { label: 'Baños', key: 'bathrooms', enabled: false},
    { label: 'Mascotas', key: 'petsAllowed', enabled: false},
    { label: 'Piso', key: 'floor', enabled: false},
    
  ]);


  private readonly _userResource = rxResource({
    request: () => this._authService.user(),
    loader: ({ request: user }) =>
      user ? this._usersService.getUserProfile(user.userId) : of(null),
  });

  constructor() {
    effect(() => (this.user = this._userResource.value()));
  }

  user = this._userResource.value();
  userId = computed(() => this._authService.user()!.userId);
  firstNameClicked = signal(false);
  lastNameClicked = signal(false);
  documentClicked = signal(false);
  phoneClicked = signal(false);
  addressClicked = signal(false);

    ngOnInit() {
    const saved = localStorage.getItem('compareAttributes');
    if (saved) {
      try {
        this.comparisonAttributes.set(JSON.parse(saved));
      } catch {
      }
    }
  }

  onComparisonAttributesChanged() {
    localStorage.setItem('compareAttributes', JSON.stringify(this.comparisonAttributes()));
  }

  onFirstNameClicked() {
    this.disableEdit();
    this.firstNameClicked.set(true);
  }

  onLastNameClicked() {
    this.disableEdit();
    this.lastNameClicked.set(true);
  }

  onNumeroDocumentoClicked() {
    this.disableEdit();
    this.documentClicked.set(true);
  }

  onPhoneClicked() {
    this.disableEdit();
    this.phoneClicked.set(true);
  }

  onAddressClicked() {
    this.disableEdit();
    this.addressClicked.set(true);
  }

  onValueSubmitted(field: keyof UserResponse, newValue: string | null) {
    this.disableEdit();
    if (newValue) this.updateUser({ ...this.user!, [field]: newValue });
  }

  private disableEdit() {
    this.documentClicked.set(false);
    this.firstNameClicked.set(false);
    this.lastNameClicked.set(false);
    this.phoneClicked.set(false);
    this.addressClicked.set(false);
  }

  private updateUser(user: UpdateUserRequest) {
    this._usersService.updateUser(this.userId(), user).subscribe({
      next: () => {
        this._notificationService.success(UPDATED_USER, 1000);
        this._userResource.reload();
      },
    });
  }
}
