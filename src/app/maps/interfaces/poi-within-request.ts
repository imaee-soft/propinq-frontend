import { PoiType } from "./poi-type.interface";

export interface PoiWithinQuery {
  north: number;
  south: number;
  east: number;
  west: number;
  limit?: number;
  types?: PoiType[]; 
  zoom?: number | null;
}
