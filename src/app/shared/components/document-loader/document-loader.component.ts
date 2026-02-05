import { Component, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-document-loader',
  imports: [MatIcon, MatLabel, MatIconButton],
  templateUrl: './document-loader.component.html',
  styleUrl: './document-loader.component.css',
})
export class DocumentLoaderComponent {
  title = input<string>('Subir contrato');
  buttonLabel = input<string>('Seleccionar PDF');

  fileUploaded = output<File>();
  fileRemoved = output<void>();

  fileName = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const selectedFile = input.files[0];

    if (selectedFile.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      input.value = '';
      return;
    }

    this.fileName.set(selectedFile.name);
    this.fileUploaded.emit(selectedFile);
    input.value = '';
  }

  removeFile(): void {
    this.fileName.set(null);
    this.fileRemoved.emit();
  }
}
