import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  readonly queryParams = toSignal(this._route.queryParams);

  clearQueryParams(): void {
    this._router.navigate([], {
      queryParams: {},
      relativeTo: this._route,
    });
  }

  pushQueryParams(params: Record<string, string | number | boolean>): void {
    this._router.navigate([], {
      queryParams: params,
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  removeQueryParams(params: string[]): void {
    const currentParams = this._route.snapshot.queryParams;
    const newParams = { ...currentParams };

    params.forEach((param) => {
      delete newParams[param];
    });

    this._router.navigate([], {
      queryParams: newParams,
      relativeTo: this._route,
    });
  }
}
