import { AuthService } from './../../auth/services/auth.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../utils/form-utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { rxResource, RxResourceOptions } from '@angular/core/rxjs-interop';
import { SignupRequest } from '../../auth/interfaces/signupRequest.interface';
import { of } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;
  myForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern)]],
    confirmPassword: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern)]],
    firstName: ['', [Validators.required, Validators.pattern(FormUtils.firstNamePattern)]],
    lastName: ['', [Validators.required, Validators.pattern(FormUtils.lastNamePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    address: ['', [Validators.required, Validators.pattern(FormUtils.addressPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.phoneNumberPattern)]],
    cuit: ['', [Validators.pattern(FormUtils.cuitPattern)]],
  },{
    validators: FormUtils.passwordMatchValidator
  });

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  private executeSignup = signal<SignupRequest | null>(null);

  private signupResource = rxResource({
    request: () => this.executeSignup() !== null ? this.executeSignup() : null,
    loader: ({ request }) => {
      if (!request) return of(null);
      return this.authService.signup(request);
    }
  });

  onSignup(){
    this.myForm.markAllAsTouched();
    this.myForm.updateValueAndValidity();

    if (this.myForm.valid) {
      this.executeSignup.set(this.myForm.value as SignupRequest);
    }
  }

  constructor() {
    effect(() => {
      const result = this.signupResource.value();
      const request = this.executeSignup();

      if (request && result !== undefined) {
        this.router.navigate(['/auth/verify-email']);
        this.executeSignup.set(null);
      }
    });
  }
}

