import { Component, computed, inject, signal } from "@angular/core";
import { PropertiesService } from "../../properties/properties.service";
import { EntityDialogService } from "../../shared/services/entity-dialog.service";
import { rxResource } from "@angular/core/rxjs-interop";
import { PropertyDetails } from "../../properties/interfaces/property-details.interface";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { of } from "rxjs";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NewHouseDialogComponent } from "../../properties/dialogs/new-house-dialog/new-house-dialog.component";
import { EditPropertyDialogComponent } from "../../properties/dialogs/edit-property-dialog/edit-property-dialog.component";

@Component({
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './property-page.component.html',
  styleUrl: './property-page.component.css',
})
export class PropertyPageComponent {
  private _propertiesService = inject(PropertiesService);
  private _entityDialogService = inject(EntityDialogService);

  hasToQuery = signal<Boolean>(true);
  pageIndex = signal(0);
  totalElements = computed<number>(
    () => this.propertiesDetailsResource.value()?.totalElements || 0
  );

  propertiesDetailsResource = rxResource({
    loader: () => {
      if (this.hasToQuery()) {
        return this._propertiesService.getPropertiesDetails(this.pageIndex());
      }
      return of(null);
    },
  });


  displayedColumns: string[] = ['name', 'description', 'actions'];


  properties = computed<PropertyDetails[] | null>(
    () => {
      const content = this.propertiesDetailsResource.value()?.content || null;
      return content;
    }
  );

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.propertiesDetailsResource.reload();
  }

  onCreate() {
    this._entityDialogService
        .openNewEntityDialog(NewHouseDialogComponent, {
          panelClass: 'generic-dialog',
          entity: 'house',
        })
        .subscribe();
  }

  onUpdate(property: PropertyDetails) {
    this._entityDialogService
          .openEditEntityDialog(EditPropertyDialogComponent, {
            panelClass: 'generic-dialog',
            entity: 'property',
            id: property.propertyId,
            width: '900px',
            data: { property },
          })
          .subscribe((wasSuccessful) => {
            if (wasSuccessful) {
              this.propertiesDetailsResource.reload();
            }
          });
  }

  onDelete(propertyId: string) {
    this._propertiesService.deleteProperty(propertyId).subscribe(() => {
      this.propertiesDetailsResource.reload();
    });
  }

  onRestore(propertyId: string) {
    this._propertiesService.restoreProperty(propertyId).subscribe(() => {
      this.propertiesDetailsResource.reload();
    });
  }
}
