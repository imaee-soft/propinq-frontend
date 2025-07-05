import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../utils/form-utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, RouterLink, MatIcon],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;
  myForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern)]],
    password: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern)]],
    confirmPassword: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern)]],
    firstName: ['', [Validators.required, Validators.pattern(FormUtils.firstNamePattern)]],
    lastName: ['', [Validators.required, Validators.pattern(FormUtils.lastNamePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    address: ['', [Validators.required, Validators.pattern(FormUtils.notSpacesPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.phoneNumberPattern)]],
    cuit: ['', [Validators.pattern(FormUtils.cuitPattern)]],
  });

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);


  onSignup(){
    console.log(this.myForm.value)
    this.myForm.markAllAsTouched();
  }
}
