import { MapCoordinate } from '../../maps/interfaces/map-coordinate.interface';

export interface CardDescriptor<T> {
  user: (entity: T) => string;
  name: (entity: T) => string;
  date: (entity: T) => Date;
  id: (entity: T) => string | number;
  coordinates: (entity: T) => MapCoordinate;
  status?: (entity: T) => string | undefined;
  secondaryActionLabel?: (entity: T) => string | undefined;
}
