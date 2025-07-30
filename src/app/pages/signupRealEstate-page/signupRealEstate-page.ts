import { AuthService } from './../../auth/services/auth.service';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../utils/form-utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { RealEstateRequest } from '../../auth/interfaces/realEstateRequest.interface';
import { of } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, RouterLink, MatProgressSpinnerModule, MatButton, MatProgressSpinnerModule],
  templateUrl: './signupRealEstate-page.html',
  styleUrls: ['./signupRealEstate-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupRealEstatePageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;
  myForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.pattern(FormUtils.usernamePattern), Validators.minLength(3), Validators.maxLength(20)]],
    firstName: ['', [Validators.required, Validators.pattern(FormUtils.firstNamePattern),Validators.minLength(3), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.pattern(FormUtils.lastNamePattern), Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern), Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern), Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.phoneNumberPattern)]],
    address: ['', [Validators.required, Validators.pattern(FormUtils.addressPattern), Validators.minLength(3), Validators.maxLength(50)]],
    companyName: ['', [Validators.required, Validators.pattern(FormUtils.companyNamePattern), Validators.minLength(3), Validators.maxLength(50)]],
    cuit: ['', [Validators.required, Validators.pattern(FormUtils.cuitPattern)]],
    legalName: ['', [Validators.required, Validators.pattern(FormUtils.legalNamePattern), Validators.minLength(3), Validators.maxLength(50)]]
  },{
    validators: FormUtils.passwordMatchValidator
  });

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  private executeSignup = signal<RealEstateRequest | null>(null);

  private signupResource = rxResource({
    request: () => this.executeSignup() !== null ? this.executeSignup() : null,
    loader: ({ request }) => {
      if (!request) return of(null);
      return this.authService.signupRealEstate(request);
    }
  });

  onSignup(){
    this.myForm.markAllAsTouched();
    this.myForm.updateValueAndValidity();

    if (this.myForm.valid) {
      const formValue = this.myForm.value;
      const realEstateRequest: RealEstateRequest = {
        username: formValue.username!,
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        password: formValue.password!,
        email: formValue.email!,
        phoneNumber: formValue.phoneNumber!,
        address: formValue.address!,
        companyName: formValue.companyName!,
        cuit: formValue.cuit!,
        legalName: formValue.legalName!
      };
      this.executeSignup.set(realEstateRequest);
    }
  }

  constructor() {
    effect(() => {
      const request = this.executeSignup();
      const result = this.signupResource.value();
      if (request && result !== undefined) {
        this.router.navigate(['/auth/verify-email'], { queryParams: { email: this.myForm.value.email } });
        this.executeSignup.set(null);
      }
    });
  }
  
  getIsLoading() {
    return this.authService.isLoading();
  }
}
