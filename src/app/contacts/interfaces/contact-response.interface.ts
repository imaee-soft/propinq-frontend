export interface ContactResponse {
  contactId: string;
  issuerFullName: string;
  message: string;
  contactState: 'CREATED' | 'ACCEPTED' | 'REJECTED';
}
