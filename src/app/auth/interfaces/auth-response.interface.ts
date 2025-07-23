import { UserAuth } from './user-auth.interface';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserAuth;
}
