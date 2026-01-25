import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { BuildingsService } from '../../buildings/buildings.service';
import { EditBuildingDialogComponent } from '../../buildings/dialogs/edit-building-dialog/edit-building-dialog.component';
import { NewBuildingDialogComponent } from '../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
@Component({
  selector: 'app-building-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './building-page.component.html',
  styleUrls: ['./building-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingPageComponent implements OnInit {
  private _buildingsService = inject(BuildingsService);
  private _router = inject(Router);
  private _entityDialogService = inject(EntityDialogService);
  private _notificationService = inject(NotificationService);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  buildings = signal<BuildingDetails[]>([]);
  totalElements = signal(0);

  descriptor: CardDescriptor<BuildingDetails> = {
    user: (b) => b.userFullName,
    name: (b) => b.name,
    date: (b) => {
      return b.createdAt ?? new Date();
    },
    id: (b) => b.buildingId,
    status: (b) => (b.deleted ? 'DELETED' : 'ACTIVE'),
    coordinates: (b) =>
      b.latitude != null && b.longitude != null
        ? { latitude: b.latitude, longitude: b.longitude }
        : DEFAULT_CENTER,
  };

  ngOnInit(): void {
    this.loadBuildings();
  }

  loadBuildings() {
    if (!this.canQuery()) return;
    this._buildingsService
      .getBuildingsDetails(this.pageIndex())
      .pipe(
        tap((newBuildings) => {
          this.buildings.set([...this.buildings(), ...newBuildings.content]);
          this.totalElements.set(newBuildings.totalElements);
          if (newBuildings.totalElements === this.buildings().length)
            this.canQuery.set(false);
        }),
      )
      .subscribe();
  }

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.loadBuildings();
  };

  create(): void {
    this._entityDialogService
      .openNewEntityDialog(NewBuildingDialogComponent, {
        panelClass: 'generic-dialog',
        backdropClass: 'generic-backdrop',
        entity: 'building',
        width: '900px',
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.resetPage();
          this.loadBuildings();
        }
      });
  }

  primaryAction = (id: string | number | undefined) => {
    const building = this.getBuilding(id);
    if (!building) return;
    this.update(building);
  };

  update(building: BuildingDetails): void {
    this._entityDialogService
      .openEditEntityDialog(EditBuildingDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'building',
        id: building.buildingId,
        width: '900px',
        data: { building },
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.resetPage();
          this.loadBuildings();
        }
      });
  }

  secondaryAction = (id: string | number | undefined) => {
    const building = this.getBuilding(id);
    if (!building) return;
    this._router.navigate(['/buildings', building.buildingId]);
  };

  thirdActionLabel = (id: string | number | undefined): string => {
    const building = this.getBuilding(id);
    if (!building) return '';
    return building.deleted ? 'Restaurar' : 'Eliminar';
  };

  thirdAction = (id: string | number | undefined) => {
    const building = this.getBuilding(id);
    if (!building) return;
    if (!building.deleted) {
      this.delete(building.buildingId);
    } else {
      this.restore(building.buildingId);
    }
  };

  delete(buildingId: string) {
    this._buildingsService.deleteBuilding(buildingId).subscribe(() => {
      this._notificationService.success(
        'El inmueble fue eliminado correctamente',
      );
      this.updateBuildingDeletion(buildingId, true);
    });
  }

  restore(buildingId: string) {
    this._buildingsService.restoreBuilding(buildingId).subscribe(() => {
      this._notificationService.success(
        'El inmueble fue restaurado correctamente',
      );
      this.updateBuildingDeletion(buildingId, false);
    });
  }

  private getBuilding(buildingId: string | number | undefined) {
    return this.buildings().find((p) => p.buildingId === buildingId);
  }

  private resetPage() {
    this.buildings.set([]);
    this.totalElements.set(0);
    this.pageIndex.set(0);
    this.canQuery.set(true);
  }

  private updateBuildingDeletion(buildingId: string, deleted: boolean) {
    this.buildings.update((buildings) =>
      buildings.map((b) =>
        b.buildingId === buildingId ? { ...b, deleted } : b,
      ),
    );
  }
}
