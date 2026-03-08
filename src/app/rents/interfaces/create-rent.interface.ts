export interface CreateRentRequest {
  contactId: string;
  date: Date;
  dueDate: Date;
  payday: number;
  price: number;
  raiseIndex: string;
  raiseMonths: number;
}
