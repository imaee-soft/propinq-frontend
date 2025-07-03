import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../utils/form-utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, RouterLink, MatDivider],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;
 myForm = this.formBuilder.group({
  username: ['', [Validators.pattern(FormUtils.notSpacesPattern)]],
  password: ['', [Validators.pattern(FormUtils.notSpacesPattern)]],
  confirmPassword: ['', [Validators.pattern(FormUtils.notSpacesPattern)]],
  firstName: ['', [Validators.pattern(FormUtils.namePattern)]],
  lastName: ['', [Validators.pattern(FormUtils.namePattern)]],
  email: ['', [Validators.pattern(FormUtils.emailPattern)]],
  address: ['', [Validators.pattern(FormUtils.notSpacesPattern)]],
  phoneNumber: ['', [Validators.pattern(FormUtils.phoneNumberPattern)]],
  cuit: ['', [Validators.pattern(FormUtils.cuitPattern)]],
});



  onSignup(){
    console.log(this.myForm.value)
    this.myForm.markAllAsTouched();
  }
}
