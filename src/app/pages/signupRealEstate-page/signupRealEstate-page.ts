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
import { of, catchError, EMPTY } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

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
  
  errorMessage = signal<string | null>(null);
  
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
      
      // Limpiar mensaje de error previo
      this.errorMessage.set(null);
      
      return this.authService.signupRealEstate(request).pipe(
        catchError((error: any) => {
          console.error('Error interceptado en componente:', error);
          
          // Verificar si es un error 409 procesado por nuestro interceptor
          if (error instanceof Error) {
            const errorMessage = error.message || '';
            
            // Verificar si tiene el status original preservado o el mensaje específico
            if ((error as any).originalStatus === 409 || errorMessage.includes('CONFLICT_ERROR')) {
              this.errorMessage.set('No se puede registrar la inmobiliaria porque ya se encuentra registrada con ese nombre de empresa o CUIT');
            } else {
              this.errorMessage.set('Error al registrar la inmobiliaria. Intente nuevamente.');
            }
          } else if (error instanceof HttpErrorResponse && error.status === 409) {
            this.errorMessage.set('No se puede registrar la inmobiliaria porque ya se encuentra registrada con ese nombre de empresa o CUIT');
          } else {
            this.errorMessage.set('Error al registrar la inmobiliaria. Intente nuevamente.');
          }
          
          // Resetear el signal para poder intentar de nuevo
          this.executeSignup.set(null);
          
          // Retornar observable vacío para evitar que se propague el error
          return EMPTY;
        })
      );
    }
  });

  onSignup(){
    this.myForm.markAllAsTouched();
    this.myForm.updateValueAndValidity();
    
    // Limpiar mensaje de error previo
    this.errorMessage.set(null);

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
      
      // Solo navegar si el resultado es exitoso y no hay mensaje de error
      if (request && result !== undefined && result !== null && !this.errorMessage()) {
        this.router.navigate(['/auth/verify-email'], { queryParams: { email: this.myForm.value.email } });
        this.executeSignup.set(null);
      }
    });
  }
  
  getIsLoading() {
    return this.authService.isLoading();
  }
  
  getErrorMessage() {
    return this.errorMessage();
  }
}
