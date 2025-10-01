export interface LocalityResponse {
  id: string;
  name: string;
  provinceId: string;
  deleted: boolean;
  latitude: number;
  longitude: number;
}

export interface LocalityRequest {
  name: string;
  provinceId: string;
  latitude: number;
  longitude: number;
}
