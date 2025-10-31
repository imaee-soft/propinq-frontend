import { computed, inject, Injectable } from '@angular/core';
import { QueryParamsService } from './query-params.service';

@Injectable({ providedIn: 'root' })
export class DialogStateService {
  private readonly _queryParamsService = inject(QueryParamsService);

  isDialogOpen = computed(() => {
    const params = this._queryParamsService.queryParams();
    return !!(params?.['entity'] && params?.['action']);
  });

  isGenericDialogOpen(dialogName: string): boolean {
    const params = this._queryParamsService.queryParams();
    return !!(params?.[dialogName]);
  }
}
