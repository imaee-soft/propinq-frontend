import { AuthStatus } from '../enums/auth-status.enum';
import { User } from './user.interface';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}
