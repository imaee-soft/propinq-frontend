export interface UpdatePropertyRequest {
  id: string;
  payload: {title: string; description: string; type: string; existingImagesURLS?: string[]; imageFiles?: File[] };
}


export interface PropertyDetails {
  propertyId:       string;
  address:          string;
  buildingId:      string;
  imagesURL:       string[];
  price:          number;
  description:      string;
  title:           string;
  floor:          number;
  bedrooms:      number;
  bathrooms:     number;
  petsAllowed:   boolean;
  area:         number;
  apartmentNumber: string;
  deleted:      boolean;
}
