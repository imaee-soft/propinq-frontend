import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-section',
  imports: [MatIconModule],
  templateUrl: './image-section.component.html',
  styleUrl: './image-section.component.css',
})
export class ImageSectionComponent {
  images = input<string[]>();
  showThumbnails = input<boolean>(false);

  imagesCount = computed(() => {
    const images = this.images();
    return images ? images.length : 0;
  });
  currentImageIndex = signal(0);
  currentImage = computed(() => {
    const images = this.images();
    const index = this.currentImageIndex();
    return images && images.length > 0 ? images[index] : null;
  });

  prevImage(): void {
    if (this.currentImageIndex() > 0) {
      this.currentImageIndex.update((i) => i - 1);
    }
  }

  nextImage(): void {
    if (this.currentImageIndex() < this.imagesCount() - 1) {
      this.currentImageIndex.update((i) => i + 1);
    }
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex.set(index);
  }
}
