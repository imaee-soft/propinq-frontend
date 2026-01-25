export interface BuildingDetails {
  buildingId: string;
  name: string;
  description: string;
  address: string;
  imagesURL: string[];
  userId: string;
  userFullName: string;
  buildingTypeName: string;
  deleted: boolean;
  favoriteId: string | null;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}
