import { PoiType } from "./poi-type.interface";

export interface PoiViewportResponse {
  id: string;
  type: PoiType | null;
  name: string;
  latitude: number;
  longitude: number;
}
