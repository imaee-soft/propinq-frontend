import { JsonPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatLabel } from '@angular/material/form-field';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
  imports: [MatLabel, JsonPipe],
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

  constructor() {
    effect(() => (this.user = this._userResource.value()));
  }
}
