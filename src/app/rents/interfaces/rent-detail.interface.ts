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
  extraDocuments: RentDocument[];
  isOwnerRetrieving: boolean;
}

export interface RentDocument {
  documentId: string;
  name: string;
  content: string;
  selected?: boolean;
}
