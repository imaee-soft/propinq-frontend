import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog/generic-dialog.component';

interface BuildingFormData {
  name: string;
  description: string;
  address: string;
}

@Component({
  selector: 'app-new-building-page',
  imports: [
    GenericDialogComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
  ],
  templateUrl: './new-building-page.component.html',
  styleUrl: './new-building-page.component.css',
})
export class NewBuildingPageComponent {
  private readonly _formBuilder = inject(FormBuilder);
  previewUrls = signal<(string | ArrayBuffer | null)[]>([]);

  form = this._formBuilder.group({
    name: this._formBuilder.control<string>('', [Validators.required]),
    description: this._formBuilder.control<string>('', [Validators.required]),
    address: this._formBuilder.control<string>('', [Validators.required]),
    images: this._formBuilder.control<File[] | null>([], [Validators.required]),
  });

  types = [
    {
      value: 'commercial',
      viewValue: 'Commercial',
    },
    {
      value: 'residential',
      viewValue: 'Residential',
    },
    {
      value: 'industrial',
      viewValue: 'Industrial',
    },
  ];

  handleSubmit(): void {
    if (this.form.valid) {
      const buildingData = this.form.value as BuildingFormData;
      console.log('Building data submitted:', buildingData);
    } else {
      console.error('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    this.form.patchValue({ images: files });
    this.form.get('images')?.markAsDirty();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.update((urls) => [...urls, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  get nameControl() {
    return this.form.get('name');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  get addressControl() {
    return this.form.get('address');
  }
}
