export interface CreateRentRequest {
  contactId: string;
  date: Date;
  yearsDuration: number;
  payday: number;
  price: number;
  raiseIndex: string;
  raiseMonths: number;
}
