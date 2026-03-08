import { Role } from '../enums/role.enum';

export interface UserAuth {
  userId: string;
  username: string;
  role: Role;
  profileChange: ProfileChange;
}

export interface ProfileChange {
  profileChangeId: string;
  roleRequested: string;
  profileChangeState: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  userFullName: string;
  userPhoneNumber: string;
}
