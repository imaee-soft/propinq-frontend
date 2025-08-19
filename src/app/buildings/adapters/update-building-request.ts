export interface UpdateBuildingRequest {
  id: string;
  payload: { name: string; description: string; type: string; existingImagesURLS?: string[]; imageFiles?: File[] };
}
