import { UpdateBuildingRequest } from './../../buildings/adapters/update-building-request';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { BuildingsService } from '../../buildings/buildings.service';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GenericDialogComponent } from '../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs/internal/observable/of';
import { BuildingDetailsPage } from '../../buildings/interfaces/buildings-details-page.interface';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { NewBuildingDialogComponent } from '../../buildings/dialogs/new-building-dialog/new-building-dialog.component';
import { EditBuildingDialogComponent } from '../../buildings/dialogs/edit-building-dialog/edit-building-dialog.component';

@Component({
  selector: 'app-building-page',
  imports: [ MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './building-page.component.html',
  styleUrls: ['./building-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingPageComponent {
  private _buildingsService = inject(BuildingsService);
  private _entityDialogService = inject(EntityDialogService); // Inyecta el servicio de diálogos

  hasToQuery = signal<Boolean>(true);
  buildingsDetailsResource = rxResource({
    loader: () => {
      if (this.hasToQuery()) {
        return this._buildingsService.getBuildingsDetails();
      }
      return of(null);
    }
  });
  buildings = computed<BuildingDetails[] | null>( () => this.buildingsDetailsResource.value()?.content || null );


  displayedColumns: string[] = ['name', 'description', 'actions'];


  onCreate(): void {

    this._entityDialogService.openNewEntityDialog(NewBuildingDialogComponent, {
      panelClass: 'generic-dialog',
      entity: 'building',
      width: '900px',
    }).subscribe(wasSuccessful => {
      if (wasSuccessful) {
        this.buildingsDetailsResource.reload();
      }
    });
  }

  onUpdate(building: BuildingDetails): void {
    this._entityDialogService.openEditEntityDialog(EditBuildingDialogComponent, {
      panelClass: 'generic-dialog',
      entity: 'building',
      id: building.buildingId,
      width: '900px',
      data: { building }
    }).subscribe(wasSuccessful => {
      if (wasSuccessful) {
        this.buildingsDetailsResource.reload();
      }
    });
  }

   onDelete(buildingId: string) {
    this._buildingsService.deleteBuilding(buildingId).subscribe()
  }

  onRestore(buildingId: string) {
    this._buildingsService.restoreBuilding(buildingId).subscribe()
  }

}
