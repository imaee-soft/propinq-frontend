import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
}
