export interface UpdatePropertyRequest {
  id: string;
  payload: {title: string; description: string; existingImagesURLS?: string[]; imageFiles?: File[]; price: number; bedrooms: number; bathrooms: number; petsAllowed: boolean; furnishing: boolean; expenses: boolean; };
}
