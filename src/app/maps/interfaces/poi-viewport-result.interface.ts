import { PoiViewportResponse } from "./poi-viewport-response.interface";

export interface PoiViewportResult {
  items: PoiViewportResponse[];
  hasMore: boolean;
}
