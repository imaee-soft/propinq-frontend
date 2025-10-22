import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { BuildingsService } from '../../buildings/buildings.service';

export function numberValidator(
  buildingId: string,
  buildingsService: BuildingsService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    console.log(
      'Validating number:',
      control.value,
      'for buildingId:',
      buildingId
    );
    if (!control.value) return of(null);
    return buildingsService.hasApartment(buildingId, control.value).pipe(
      map((isTaken: boolean) =>
        isTaken ? { numberTaken: 'El número ya está en uso' } : null
      ),
      catchError(() => of(null))
    );
  };
}
