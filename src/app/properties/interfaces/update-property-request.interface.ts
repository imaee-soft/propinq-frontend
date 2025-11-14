export interface UpdatePropertyRequest {
  id: string;
  payload: {title: string; description: string; type: string; existingImagesURLS?: string[]; imageFiles?: File[]; price: number; bedrooms: number; bathrooms: number; petsAllowed: boolean; furnishing: boolean; expenses: boolean; };
}
