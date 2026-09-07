import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
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
import { environment } from '../../../../environments/environment';
import { RecaptchaLegalNoticeComponent } from '../../../shared/components/recaptcha-legal-notice/recaptcha-legal-notice.component';

declare const grecaptcha: {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

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
    RouterLink,
    RecaptchaLegalNoticeComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);
  hidePassword: WritableSignal<boolean> = signal(true);
  recaptchaReady: WritableSignal<boolean> = signal(false);

  private readonly siteKey = environment.reCAPTCHA_SiteKey;
  readonly captchaEnabled = environment.reCAPTCHA_enabled === true;
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
    if (this.captchaEnabled && isPlatformBrowser(this.platformId)) {
      this.loadRecaptchaScript();
    }
  }

  loadRecaptchaScript() {
    if (document.getElementById('recaptcha-script')) {
      this.markRecaptchaReady();
      return;
    }
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.markRecaptchaReady();
    script.onerror = () => {
      this.errorMessage.set(
        'No se pudo cargar reCAPTCHA. Revisá tu conexión o recargá la página.',
      );
    };
    document.body.appendChild(script);
  }

  private markRecaptchaReady() {
    if (!isPlatformBrowser(this.platformId) || typeof grecaptcha === 'undefined') {
      return;
    }
    grecaptcha.ready(() => this.recaptchaReady.set(true));
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

    if (this.captchaEnabled && isPlatformBrowser(this.platformId)) {
      if (typeof grecaptcha === 'undefined') {
        this.errorMessage.set('reCAPTCHA aún no está listo. Esperá un momento e intentá de nuevo.');
        this.isLoading.set(false);
        return;
      }
      grecaptcha.ready(() => {
        grecaptcha
          .execute(this.siteKey, { action: 'login' })
          .then((token: string) => this.processLogin(token))
          .catch(() => {
            this.errorMessage.set(
              'No se pudo verificar reCAPTCHA. Si estás en local, confirmá que localhost está permitido en Google reCAPTCHA.',
            );
            this.isLoading.set(false);
          });
      });
      return;
    }

    this.processLogin(null);
  }

  private processLogin(recaptchaToken: string | null) {
    const credentials = {
      ...this.loginForm.value,
      recaptchaToken,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response?.user?.userId) {
          localStorage.setItem('userId', response.user.userId);
        }
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message ||
            error?.message ||
            'Error al iniciar sesión',
        );
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
