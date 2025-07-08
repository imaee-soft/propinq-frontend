export interface SignupRequest {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  cuit?: string;
  birthDate: string;
}
