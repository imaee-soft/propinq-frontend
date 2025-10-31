export interface BuildingRequest {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  userId: string;
  images: File[];
}
