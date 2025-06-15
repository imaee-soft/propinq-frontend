import { Role } from '../enums/role.enum';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
}
