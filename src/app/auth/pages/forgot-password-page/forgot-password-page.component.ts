import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../users/services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly notifications = inject(NotificationService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  isLoading: WritableSignal<boolean> = signal(false);
  sent: WritableSignal<boolean> = signal(false);

  get email() {
    return this.form.get('email');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.userService.sendRecoverPasswordEmail(this.form.value.email).subscribe({
      next: () => {
        this.sent.set(true);
        this.notifications.success(
          'Si el email existe, enviamos instrucciones para recuperar tu contraseña.',
        );
      },
      error: (error) => {
        this.notifications.error(
          error?.error?.message || 'No se pudo enviar el email de recuperación.',
        );
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
