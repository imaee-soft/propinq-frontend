export interface NeighborhoodResponse {
  id: string;
  name: string;
  localityId: string;
  deleted: boolean;
}

export interface NeighborhoodRequest {
  name: string;
  localityId: string;
}
