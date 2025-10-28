export interface CreatePropertyRequest {
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  petsAllowed: boolean;
  hasFurniture: boolean;
  paysExpenses: boolean;
  type: 'APARTAMENTO' | 'CASA';
  number?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  buildingId?: string;
  userId?: string;
  images: File[] | null;
}
