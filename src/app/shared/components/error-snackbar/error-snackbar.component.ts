import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'snack-bar-overview-example',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-form-field>
      <mat-label>Message</mat-label>
      <input matInput value="Disco party!" #message>
    </mat-form-field>

    <mat-form-field>
      <mat-label>Action</mat-label>
      <input matInput value="Dance" #action>
    </mat-form-field>

    <button mat-raised-button color="primary"
      (click)="tryShowSnackBar(message.value, action.value)">
      Show snack-bar
    </button>
  `
})
export class SnackBarOverviewExampleComponent {
  tryShowSnackBar(message: string, action: string) {
    if (!message || !action) {
      throw new Error('El mensaje y la acción no pueden estar vacíos');
    }
    // Aquí podemos hacer lógica normal, pero al lanzar el error, lo maneja el ErrorHandler global
  }
}
