import { UpdateBuildingRequest } from './../../buildings/adapters/update-building-request';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { BuildingsService } from '../../buildings/buildings.service';
import { BuildingDetails } from '../../buildings/interfaces/building-details.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GenericDialogComponent } from '../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';
import { rxResource } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-building-page',
  imports: [ MatTableModule, MatIconModule, MatButtonModule, GenericDialogComponent],
  templateUrl: './building-page.component.html',
  styleUrls: ['./building-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingPageComponent {
  private _buildingsService = inject(BuildingsService);
  buildingsDetailsResource = rxResource({
    loader: () => {
      return this._buildingsService.getBuildingsDetails();
    },
  });
  buildings: WritableSignal<BuildingDetails[]> = signal<BuildingDetails[]>([]);

  constructor() {
    effect(() => {
      const buildings = this.buildingsDetailsResource.value() ?? [];
      this.buildings.set(buildings);
    });
  }
  displayedColumns: string[] = ['name', 'description', 'actions'];
  update = signal<Boolean>(false);
  create = signal<Boolean>(false);
  updateDialogTitle = signal('Actualizar Inmueble');
  createDialogTitle = signal('Crear Inmueble');

  onDelete(building: BuildingDetails) {

    this._buildingsService.deleteBuilding(building).subscribe(() => {
      this.buildings.set(this.buildings().filter(b => b !== building));
    });

  }

  onRestore(building: BuildingDetails){

  }


  onUpdate(building: BuildingDetails) {
    this.create.set(true);

  }
  onCreate() {
    this.update.set(true);
  }

  updateBuilding(building: BuildingDetails){
    const updateRequest: UpdateBuildingRequest = {
      name: building.name,
      description: building.description,
      type: building.buildingTypeName,
      imagesURL: building.imagesURL || [],
    };

    this._buildingsService.updateBuilding(building.buildingId, updateRequest).subscribe((updatedBuilding) => {
      const updatedBuildings = this.buildings().map(b => b.buildingId === updatedBuilding.buildingId ? updatedBuilding : b);
      this.buildings.set(updatedBuildings);
    });
  }

}
