import { Pageable } from '../../shared/interfaces/pageable.interface';
import { Sort } from '../../shared/interfaces/sort.interface';
import { ContactDetails } from './contact-details.interface';

export interface ContactDetailsPage {
  content: ContactDetails[];
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
