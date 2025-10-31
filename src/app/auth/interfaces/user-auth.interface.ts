import { Role } from '../enums/role.enum';

export interface UserAuth {
  userId: string;
  username: string;
  role: Role;
}
