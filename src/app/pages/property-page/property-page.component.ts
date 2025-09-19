import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, ResourceStatus, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertiesService } from '../../properties/properties.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { map, Observable, of, Subscription } from 'rxjs';


@Component({
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule],
  templateUrl: './property-page.component.html',
  styleUrl: './property-page.component.css',
})
export class PropertyPageComponent {
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesService);

  public currentImageIndex = signal(0);
  propertyId = toSignal(
  this.route.paramMap.pipe(map(params => params.get('propertyId'))));
  resourceStatus = computed(() => {
    if (this.propertyDetailsResource.status() === ResourceStatus.Error) {
      return 1;
    }
    if (this.propertyDetailsResource.status() === ResourceStatus.Loading) {
      return 2;
    }
    if (this.propertyDetailsResource.status() === ResourceStatus.Resolved) {
      return 4;
    }
    return 0;
  });

  propertyDetailsResource = rxResource({
    request: this.propertyId,
    defaultValue: null,
    loader: () => {
      const propertyQueried = this.propertyId();
      if(propertyQueried == null) return of(null);
      return this.propertiesService.getPropertyDetails(propertyQueried);
    },
  });

  get images(): string[] {
    const resource = this.propertyDetailsResource;
    if (resource.status() === ResourceStatus.Resolved && resource.value) {
      return resource.value()?.imagesURL ?? [];
    }
    return [];
  }

  prevImage(): void {
    if (this.currentImageIndex() > 0) {
      this.currentImageIndex.update(i => i - 1);
    }
  }

  nextImage(): void {
    if (this.currentImageIndex() < this.images.length - 1) {
      this.currentImageIndex.update(i => i + 1);
    }
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex.set(index);
  }
}
