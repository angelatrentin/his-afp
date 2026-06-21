import { catchError, map, Observable, of, switchMap, take, timer } from 'rxjs';
import { PatientManager } from './patient-manager';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

export class AsyncCheckCF {
  static check(pzManager: PatientManager): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => pzManager.ricercaPaziente(control.value)),
        map((res) => {
          return res.results && res.results > 0 ? { cfEsistente: true } : null;
        }),
        catchError(() => of(null)),
        take(1),
      );
    };
  }
}
