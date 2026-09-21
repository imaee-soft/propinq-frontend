import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private _breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this._breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(map((result) => result.matches)),
    { initialValue: window.innerWidth <= 768 },
  );
}
