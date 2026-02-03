import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { QueryParamsService } from './query-params.service';

interface DialogConfig extends MatDialogConfig {
  entity: string;
}

@Injectable({ providedIn: 'root' })
export class EntityDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly queryParamsService = inject(QueryParamsService);

  openNewEntityDialog<T>(component: ComponentType<T>, config: DialogConfig) {
    const { entity, ...rest } = config;
    this.queryParamsService.pushQueryParams({ entity, action: 'new' });
    const dialogRef = this.dialog.open(component, rest);
    return dialogRef.afterClosed().pipe(
      finalize(() => {
        this.queryParamsService.removeQueryParams(['entity', 'action']);
      }),
    );
  }

  openEditEntityDialog<T>(
    component: ComponentType<T>,
    config: DialogConfig & { id: string },
  ) {
    const { entity, id, ...rest } = config;
    this.queryParamsService.pushQueryParams({ entity, action: 'edit', id });
    const dialogRef = this.dialog.open(component, rest);
    return dialogRef.afterClosed().pipe(
      finalize(() => {
        this.queryParamsService.removeQueryParams(['entity', 'action', 'id']);
      }),
    );
  }

  openActionsDialog<T>(
    component: ComponentType<T>,
    config: DialogConfig & { id: string; action: string },
  ) {
    const { entity, id, action, ...rest } = config;
    this.queryParamsService.pushQueryParams({ entity, action, id });
    const dialogRef = this.dialog.open(component, rest);
    return dialogRef.afterClosed().pipe(
      finalize(() => {
        this.queryParamsService.removeQueryParams(['entity', 'action', 'id']);
      }),
    );
  }

  openComparisionDialog<T>(
    component: ComponentType<T>,
    config: DialogConfig & { action: string },
  ) {
    const { entity, action, ...rest } = config;
    this.queryParamsService.pushQueryParams({ entity, action });
    const dialogRef = this.dialog.open(component, rest);
    return dialogRef.afterClosed().pipe(
      finalize(() => {
        this.queryParamsService.removeQueryParams(['entity', 'action']);
      }),
    );
  }
}
