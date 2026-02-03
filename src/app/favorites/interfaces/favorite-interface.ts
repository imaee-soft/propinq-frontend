import { Pageable } from '../../shared/interfaces/pageable.interface';
import { Sort } from '../../shared/interfaces/sort.interface';

export interface FavoriteRequest {
  userID: string;
  buildingID?: string;
  propertyID?: string;
}

export interface FavoriteResponse {
  favoriteID: string;
  userID: string;
  buildingID?: string;
  propertyID?: string;
}

export interface FavoriteEntity {
  favoriteId: string;
  entityId: string;
  type: 'property' | 'building';
  title: string;
  ownerName: string;
  date: Date;
  latitude?: number;
  longitude?: number;
  favoriteDate: Date;
}

export interface FavoriteEntityPage {
  content: FavoriteEntity[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
