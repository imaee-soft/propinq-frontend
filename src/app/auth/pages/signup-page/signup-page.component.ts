import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FormUtils } from '../../../pages/utils/form-utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { SignupRequest } from '../../interfaces/signupRequest.interface';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatButton,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;
  myForm = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(FormUtils.notSpacesPattern),
          Validators.minLength(6),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(FormUtils.notSpacesPattern),
          Validators.minLength(6),
        ],
      ],
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern(FormUtils.firstNamePattern),
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern(FormUtils.lastNamePattern),
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.pattern(FormUtils.addressPattern),
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(FormUtils.phoneNumberPattern)],
      ],
      birthDate: [
        '',
        [Validators.required, Validators.pattern(FormUtils.datePattern)],
      ],
    },
    {
      validators: FormUtils.passwordMatchValidator,
    },
  );

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  private executeSignup = signal<SignupRequest | null>(null);

  private signupResource = rxResource({
    request: () =>
      this.executeSignup() !== null ? this.executeSignup() : null,
    loader: ({ request }) => {
      if (!request) return of(null);
      return this.authService.signup(request);
    },
  });

  onSignup() {
    this.myForm.markAllAsTouched();
    this.myForm.updateValueAndValidity();

    if (this.myForm.valid) {
      this.executeSignup.set(this.myForm.value as SignupRequest);
    }
  }

  constructor() {
    effect(() => {
      const request = this.executeSignup();
      const result = this.signupResource.value();
      if (request && result !== undefined) {
        this.router.navigate(['/auth/verify-email'], {
          queryParams: { email: this.myForm.value.email },
        });
        this.executeSignup.set(null);
      }
    });
  }
  getIsLoading() {
    return this.authService.isLoading();
  }
}
