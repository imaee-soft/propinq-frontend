export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  cuit?: string;
}
