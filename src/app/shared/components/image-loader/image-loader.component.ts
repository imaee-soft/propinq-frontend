import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'image-loader',
  imports: [MatLabel, MatButton],
  templateUrl: './image-loader.component.html',
  styleUrl: './image-loader.component.css',
})
export class ImageLoaderComponent {
  title = input<string>('Subir imágenes');
  buttonLabel = input<string>('Seleccionar imágenes');
  images = input<File[] | null>(null);
  imageUploaded = output<File[]>();
  imageRemoved = output<number>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  previewUrls = signal<(string | ArrayBuffer | null)[]>([]);

  triggerClick(): void {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
    }
  }

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
    input.value = '';
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
