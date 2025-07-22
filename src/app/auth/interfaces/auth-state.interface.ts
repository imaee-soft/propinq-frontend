import { AuthStatus } from '../enums/auth-status.enum';
import { UserAuth } from './user-auth.interface';

export interface AuthState {
  user: UserAuth | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
}
