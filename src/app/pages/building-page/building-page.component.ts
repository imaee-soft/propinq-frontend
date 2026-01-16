import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs/internal/observable/of';
import { BuildingsService } from '../../buildings/buildings.service';
import { EditBuildingDialogComponent } from '../../buildings/dialogs/edit-building-dialog/edit-building-dialog.component';
import { NewBuildingDialogComponent } from '../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import { Page } from '../../shared/interfaces/page.interface';
import { CommonEntityPageComponent } from '../../shared/pages/common-entity-page/common-entity-page.component';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
@Component({
  selector: 'app-building-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './building-page.component.html',
  styleUrls: ['./building-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingPageComponent implements OnInit {
  private _buildingsService = inject(BuildingsService);
  private _entityDialogService = inject(EntityDialogService);
  private renderer = inject(Renderer2);

  hasToQuery = signal<Boolean>(true);
  pageIndex = signal(0);

  readonly page = computed<Page<BuildingDetails> | null>(() => {
    const value = this.buildingsDetailsResource.value();
    if (!value) return null;

    return {
      content: value.content,
      total: value.totalElements,
    };
  });

  pageContent = computed<BuildingDetails[]>(
    () => this.buildingsDetailsResource.value()?.content || []
  );

  totalElements = computed<number>(
    () => this.buildingsDetailsResource.value()?.totalElements || 0
  );

  buildingsDetailsResource = rxResource({
    loader: () => {
      if (this.hasToQuery()) {
        return this._buildingsService.getBuildingsDetails(this.pageIndex());
      }
      return of(null);
    },
  });

  descriptor: CardDescriptor<BuildingDetails> = {
    user: (b) => b.userFullName,
    name: (b) => b.name,
    date: () => {
      // Si tienes fecha en BuildingDetails, úsala aquí. Por ahora null.
      return new Date(); // TODO: reemplazar por b.createdAt si existe
    },
    id: (b) => b.buildingId,
    status: (b) => (b.deleted ? 'ELIMINADO' : b.buildingTypeName),
    coordinates: (b) =>
      b.latitude != null && b.longitude != null
        ? { latitude: b.latitude, longitude: b.longitude }
        : DEFAULT_CENTER, // o DEFAULT_CENTER si lo tienes accesible}
  };

  ngOnInit() {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  ngOnDestroy() {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  openBuilding = (id: string | number | undefined) => {
    const building = this.buildingsDetailsResource
      .value()
      ?.content.find((b) => b.buildingId === id);
    if (!building) return;

    this.onUpdate(building);
  };

  deleteOrRestoreBuilding = (id: string | number | undefined) => {
    const building = this.buildingsDetailsResource
      .value()
      ?.content.find((b) => b.buildingId === id);
    if (!building) return;

    if (!building.deleted) {
      this.onDelete(building.buildingId);
    } else {
      this.onRestore(building.buildingId);
    }
  };

  loadMore = () => {
    // Siguiente página
    this.pageIndex.update((i) => i + 1);
    this.buildingsDetailsResource.reload();
  };
  onCreate(): void {
    this._entityDialogService
      .openNewEntityDialog(NewBuildingDialogComponent, {
        panelClass: 'generic-dialog',
        entity: 'building',
        width: '900px',
      })
      .subscribe((wasSuccessful) => {
        if (wasSuccessful) {
          this.buildingsDetailsResource.reload();
        }
      });
  }

  onUpdate(building: BuildingDetails): void {
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
          this.buildingsDetailsResource.reload();
        }
      });
  }

  onDelete(buildingId: string) {
    this._buildingsService.deleteBuilding(buildingId).subscribe(() => {
      this.buildingsDetailsResource.reload();
    });
  }

  onRestore(buildingId: string) {
    this._buildingsService.restoreBuilding(buildingId).subscribe(() => {
      this.buildingsDetailsResource.reload();
    });
  }
}
