import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { of } from 'rxjs';
<<<<<<< HEAD
import { AuthService } from '../../../auth/services/auth.service';
import { PhonePipe } from '../../../shared/pipes/phone-number.pipe';
import { DynamicInputComponent } from '../../components/dynamic-input.component';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
  imports: [
    MatLabel,
    MatCardModule,
    MatIcon,
    DatePipe,
    PhonePipe,
    DynamicInputComponent,
  ],
})
export class UserAccountComponent {
  private _usersService = inject(UsersService);
  private _authService = inject(AuthService);

  private readonly _userResource = rxResource({
    request: () => this._authService.user(),
    loader: ({ request: user }) =>
      user ? this._usersService.getUserProfile(user.userId) : of(null),
  });

  user = this._userResource.value();
  documentClicked = signal(false);
  birthDateClicked = signal(false);
  phoneClicked = signal(false);
  addressClicked = signal(false);

  constructor() {
    effect(() => (this.user = this._userResource.value()));
  }

  onClickedNumeroDocumento() {
    this.documentClicked.set(true);
  }

  onDniSubmitted(newValue: string | null) {
    console.log('Value received: ', newValue);
    this.documentClicked.set(false);
  }
}
