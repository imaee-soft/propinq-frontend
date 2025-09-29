
export interface PropertyTypeResponse {
  id: string;
  name: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropertyTypeRequest {
  name: string;
  description?: string;
}
