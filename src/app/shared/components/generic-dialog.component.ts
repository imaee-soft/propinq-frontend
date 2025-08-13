import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyTypeFormDialogComponent } from '../../propertyType/components/property-type-form-dialog.component';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [CommonModule, PropertyTypeFormDialogComponent],
  template: `
    <div class="generic-dialog">
      <h3>{{ dialogTitle }}</h3>
      <app-property-type-form-dialog></app-property-type-form-dialog>
    </div>
  `,
  styles: [`
    .generic-dialog {
      background: #222438;
      border-radius: 18px;
      padding: 24px;
      color: white;
    }
    
    .generic-dialog h3 {
      margin: 0 0 16px 0;
      font-size: 1.5rem;
      font-weight: 500;
      text-align: center;
    }
  `]
})
export class GenericDialogComponent {
  @Input() dialogTitle: string = '';
}
