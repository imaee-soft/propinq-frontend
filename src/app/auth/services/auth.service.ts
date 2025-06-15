import { computed, Injectable, signal } from '@angular/core';
import { AuthStatus } from '../enums/auth-status.enum';
import { AuthState } from '../interfaces/auth-state.interface';

const INITIAL_STATE: AuthState = {
  user: null,
  status: AuthStatus.AUTHENTICATED,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _authState = signal(INITIAL_STATE);

  user = computed(() => this._authState().user);
  status = computed(() => this._authState().status);

  logout() {
    this._authState.set({
      user: null,
      status: AuthStatus.UNAUTHENTICATED,
    });
  }
}
