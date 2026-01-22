import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BuildingDetails } from '../../../buildings/interfaces/building-details.interface';
import { ImageSectionComponent } from '../image-section/image-section.component';

@Component({
  selector: 'app-home-building-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    ImageSectionComponent,
  ],
  templateUrl: './home-building-card.component.html',
  styleUrls: [
    './home-building-card.component.css',
    '../home-property-card/home-property-card.component.css',
  ],
})
export class HomeBuildingCardComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  building = input<BuildingDetails>();
  close = output<void>();
  favorite = output<void>();

  loggedUser = computed(() => this._authService.user());

  goToBuildingDetails() {
    this._router.navigate(['/buildings', this.building()?.buildingId]);
  }
}
