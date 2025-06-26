export interface Address {
  lat: string;
  lon: string;
  display_name: string;
  address: ExplicitAddress;
  boundingbox: string[];
}

export interface ExplicitAddress {
  house_number?: string;
  road?: string;
  town?: string;
  state?: string;
}
