export interface ContactDetails {
  contactId: string;
  propertyId: string;
  contactDate: Date;
  owner: string;
  issuer: string;
  message?: string;
  answerDate?: Date;
  answer?: string;
  ownerPhoneNumber?: string;
  propertyAddress: string;
  status: string;
  latitude: number;
  longitude: number;
  isOwnerRetrieving: boolean;
}
