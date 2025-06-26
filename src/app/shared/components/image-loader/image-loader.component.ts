import { Component, input, output, signal } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'image-loader',
  imports: [MatLabel, MatIcon],
  templateUrl: './image-loader.component.html',
  styleUrl: './image-loader.component.css',
})
export class ImageLoaderComponent {
  title = input<string>('Subir imágenes');
  images = input<File[] | null>(null);
  imageUploaded = output<File[]>();
  imageRemoved = output<number>();

  previewUrls = signal<(string | ArrayBuffer | null)[]>([]);

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.update((urls) => [...urls, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    this.imageUploaded.emit(files);
  }

  removeImage(index: number): void {
    this.previewUrls.update((urls) => {
      const updated = [...urls];
      updated.splice(index, 1);
      return updated;
    });
    this.imageRemoved.emit(index);
  }
}
