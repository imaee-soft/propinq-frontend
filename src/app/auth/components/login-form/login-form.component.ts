import { Component, inject, OnInit, PLATFORM_ID, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { environment } from '../../../../environments/environment';

declare var grecaptcha: any;


@Component({
  selector: 'app-login-form',
  standalone: true,
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
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  private notificationService = inject(NotificationService);

  loginForm: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);
  hidePassword: WritableSignal<boolean> = signal(true);

  private readonly siteKey = environment.reCAPTCHA_SiteKey;
  private platformId = inject(PLATFORM_ID);

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRecaptchaScript();
    }
  }

  loadRecaptchaScript() {
    if (document.getElementById('recaptcha-script')) {
      return;
    }
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (isPlatformBrowser(this.platformId) && (window as any).grecaptcha) {
      grecaptcha.ready(() => {
        grecaptcha.execute(this.siteKey, { action: 'login' }).then((token: string) => {

          this.notificationService.success('reCAPTCHA validado correctamente');
          this.processLogin(token);
        }, (error: any) => {
          this.notificationService.error('Error de seguridad con reCAPTCHA. Intente nuevamente.');

          this.isLoading.set(false);
        });
      });
    } else {
      this.notificationService.error('No se pudo cargar el sistema de seguridad. Intentando acceso directo...');
      this.processLogin(null);
    }
  }
  private processLogin(recaptchaToken: string | null) {
    const credentials = {
      ...this.loginForm.value,
      recaptchaToken: recaptchaToken
      };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response && response.user && response.user.userId) {
          localStorage.setItem('userId', response.user.userId);
        }
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || 'Error al iniciar sesión');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
