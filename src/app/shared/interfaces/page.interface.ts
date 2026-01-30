import { Pageable } from './pageable.interface';
import { Sort } from './sort.interface';

export interface Page<T> {
  content: T[];
  total: number;
}

export interface LargePage<T> {
  content: T[];
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
