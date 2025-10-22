import { Pageable } from "../../shared/interfaces/pageable.interface";
import { Sort } from "../../shared/interfaces/sort.interface";
import { PropertyDetails } from "./property-details.interface";

export interface PropertyDetailsPage {
  content: PropertyDetails[];
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
