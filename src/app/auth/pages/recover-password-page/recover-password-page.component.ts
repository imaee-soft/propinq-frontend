import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../users/services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-recover-password-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './recover-password-page.component.html',
  styleUrls: ['./recover-password-page.component.css'],
})
export class RecoverPasswordPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly notifications = inject(NotificationService);

  form: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );
  isLoading: WritableSignal<boolean> = signal(false);
  hidePassword: WritableSignal<boolean> = signal(true);
  token: string | null = null;
  missingToken: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.missingToken.set(!this.token);
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit() {
    if (!this.token) {
      this.missingToken.set(true);
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.userService
      .recoverPassword(
        this.form.value.password,
        this.form.value.confirmPassword,
        this.token,
      )
      .subscribe({
        next: () => {
          this.notifications.success('Contraseña actualizada. Ya podés iniciar sesión.');
          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          this.notifications.error(
            error?.error?.message || 'No se pudo restablecer la contraseña.',
          );
          this.isLoading.set(false);
        },
        complete: () => this.isLoading.set(false),
      });
  }
}
