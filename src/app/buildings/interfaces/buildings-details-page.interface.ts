import { Pageable } from "../../shared/interfaces/pageable.interface";
import { Sort } from "../../shared/interfaces/sort.interface";
import { BuildingDetails } from "./building-details.interface";

export interface BuildingDetailsPage {
  content: BuildingDetails[];
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


