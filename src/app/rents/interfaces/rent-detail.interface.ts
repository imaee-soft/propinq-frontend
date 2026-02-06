export interface RentDetail {
  rentId: string;
  propertyId: string;
  contactId: string;
  rentDate: Date;
  rentDueDate: Date;
  payday: number;
  rentPrice: number;
  raiseIndex: string;
  raiseMonths: number;
  tenantFullName: string;
  ownerFullName: string;
  propertyName: string;
  latitude: number;
  longitude: number;
  contract: string;
  extraDocuments: string[];
  isOwnerRetrieving: boolean;
}
