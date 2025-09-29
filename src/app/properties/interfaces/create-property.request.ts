export interface CreatePropertyRequest {
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  petsAllowed: boolean;
  type: 'APARTAMENTO' | 'CASA';
  area?: number;
  number?: string;
  address?: string;
  buildingId?: string;
  userId?: string;
  images: File[] | null;
}
