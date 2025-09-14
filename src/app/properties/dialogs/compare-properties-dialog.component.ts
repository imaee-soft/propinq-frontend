import { Component, computed, inject, Inject, input, Input, Signal, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertyDetails } from '../../properties/interfaces/property-details.interface';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserComparisonAttribute } from '../../users/interfaces/user-comparison-attribute';
import { Router } from '@angular/router';

interface ComparePropertyAttribute {
  label: string;
  key: keyof PropertyDetails;
  type?: 'boolean' | 'number' | 'string';
  higherIsBetter?: boolean;
}

@Component({
  imports: [MatIcon, CommonModule],
  selector: 'compare-properties-dialog',
  templateUrl: './compare-properties-dialog.component.html',
  styleUrl: './compare-properties-dialog.component.css'
})
export class ComparePropertiesDialogComponent {
  router = inject(Router);
  public data = inject(MAT_DIALOG_DATA) as {
    properties: PropertyDetails[],
    compareAttributes: UserComparisonAttribute[]
  };
  public properties: Signal<PropertyDetails[]> = signal(this.data.properties ?? []);



  private readonly typeMap: Record<string, 'boolean' | 'number' | 'string'> = {
    address: 'string',
    title: 'string',
    price: 'number',
    area: 'number',
    bedrooms: 'number',
    bathrooms: 'number',
    floor: 'number',
    apartmentNumber: 'string',
    petsAllowed: 'boolean'
  };

  private readonly higherMap: Record<string, boolean | undefined> = {
    price: false,
    area: true,
    bedrooms: true,
    bathrooms: true,
    petsAllowed: true
  };

    public attributes: Signal<ComparePropertyAttribute[]> = signal([
    { label: 'Dirección', key: 'address', type: 'string' },
    { label: 'Título', key: 'title', type: 'string' },
    { label: 'Precio', key: 'price', type: 'number', higherIsBetter: false },
    { label: 'Superficie (m²)', key: 'area', type: 'number', higherIsBetter: true },
    { label: 'Ambientes', key: 'bedrooms', type: 'number', higherIsBetter: true },
    { label: 'Baños', key: 'bathrooms', type: 'number', higherIsBetter: true },
    { label: 'Piso', key: 'floor', type: 'number' },
    { label: 'N° Departamento', key: 'apartmentNumber', type: 'string' },
    { label: 'Mascotas', key: 'petsAllowed', type: 'boolean', higherIsBetter: true },
  ]);

  public comparedKeys: Signal<Set<string>> = signal(
    new Set((this.data.compareAttributes ?? []).filter(a => a.enabled).map(a => a.key))
  );
  private dialogRef = inject(MatDialogRef<ComparePropertiesDialogComponent>);

  getPhoto(property: PropertyDetails): string {
    return property.imagesURL && property.imagesURL.length > 0
      ? property.imagesURL[0]
      : 'https://placehold.co/80x60?text=Propiedad';
  }

  displayBoolean(val: boolean): string {
    return val ? 'Sí' : 'No';
  }

  close() {
    this.dialogRef.close();
  }

  getCellClass(attr: ComparePropertyAttribute, property: PropertyDetails): string {
    if (!this.comparedKeys().has(attr.key)) return '';

    if (attr.type !== 'number' && attr.type !== 'boolean') return '';

    const vals = this.properties().map(p => Number(p[attr.key]));
    if (vals.length < 2) return '';

    let targetValue = attr.higherIsBetter ? Math.max(...vals) : Math.min(...vals);

    if (attr.type === 'boolean') {
      targetValue = attr.higherIsBetter !== false ? 1 : 0;
    }

    const currentValue = attr.type === 'boolean' ? (property[attr.key] ? 1 : 0) : Number(property[attr.key]);
    if (currentValue === targetValue) {
      return 'compare-best';
    }
    return '';
  }

  goToProperty(propertyId: string){
    if (!propertyId) return;
    this.dialogRef.close();
    this.router.navigate(['/properties', propertyId]);
  }
}
