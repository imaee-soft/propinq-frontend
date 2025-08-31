<<<<<<< HEAD
import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

=======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
>>>>>>> f054cd9 ((WIP): Iniciar sesion)

@Component({
  selector: 'app-login-form',
  standalone: true,
<<<<<<< HEAD
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
=======
  imports: [CommonModule, ReactiveFormsModule],
>>>>>>> f054cd9 ((WIP): Iniciar sesion)
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
<<<<<<< HEAD
  
  loginForm: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);
  hidePassword: WritableSignal<boolean> = signal(true);
=======
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
>>>>>>> f054cd9 ((WIP): Iniciar sesion)

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

<<<<<<< HEAD
  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
=======
  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;
>>>>>>> f054cd9 ((WIP): Iniciar sesion)
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error) => {
<<<<<<< HEAD
        this.errorMessage.set(error?.error?.message || 'Error al iniciar sesión');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
=======
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
>>>>>>> f054cd9 ((WIP): Iniciar sesion)
      }
    });
  }
}
