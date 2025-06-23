import { Component, inject, Input } from '@angular/core';
import { MapComponent } from '../../maps/components/map/map.component';
import { DEFAULT_MAP_CONFIG } from '../../maps/utils/constants';
import { BuildingService } from '../../buildings/services/building.service';

@Component({
  selector: 'app-home-page',
  imports: [MapComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  mapConfig = DEFAULT_MAP_CONFIG;
  buildingMarkers = Input()

  
}
