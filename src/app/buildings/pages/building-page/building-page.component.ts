import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BuildingService } from '../../services/building.service';
import { DEFAULT_CENTER, DEFAULT_MAP_CONFIG } from '../../../maps/utils/constants';
import { of } from 'rxjs';


@Component({
  selector: 'app-building-page',
  imports: [],
  template: `<p>building-page works!</p>`,
  styleUrl: './building-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingPageComponent {
    mapConfig = computed(() => ({
      center: DEFAULT_CENTER,
      zoom: 14.5,
      enableClick: true,
      enableControls: false,
      markers: this.buildingMarkers()
    }));
    buildingService = inject(BuildingService);
  buildingsResource = rxResource({
    loader: () => {
      return this.buildingService.getBuildings();
    }
});

buildingMarkers = computed(() => (this.buildingsResource.value() ?? []).map(building => ({
  id: building.buildingId,
  coordinate: {
    lat: building.latitude,
    lng: building.longitude,
  },
})));

}
