import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormUtils {
  static firstNamePattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)?$";
  static lastNamePattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)?$";
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static addressPattern = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.,#\\s]+$';
  static notSpacesPattern = '^\\S+$';
  static phoneNumberPattern = '^[0-9]{10}$';
  static cuitPattern = '^[0-9]{2}-[0-9]{8}-[0-9]$';
  static dniPattern = '^[0-9]{8}$';
  static datePattern = '^\\d{4}-\\d{2}-\\d{2}$';


static isValidField(form: FormGroup, fieldName: string): boolean | null {
  const control = form.controls[fieldName];
  return !!control.errors && control.touched;
}

static getFieldError(form: FormGroup, fieldName: string, inputName?: string): string | null {
  if (!form.controls[fieldName]) return null;

  const errors = form.controls[fieldName].errors ?? {};
  return FormUtils.getTextError(errors, inputName);
}

  static getTextError(errors: ValidationErrors, inputName?: string):string | null {
    console.log(errors)
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Debe ingresar al menos ${errors['minlength'].requiredLength} caracteres`;

        case 'maxlength':
          return `Debe ingresar como máximo ${errors['maxlength'].requiredLength} caracteres`;

        case 'min':
          return `Este campo debe ser mayor o igual ${errors['min'].min}`;

        case 'email':
          return 'El correo no es válido';

        case 'pattern':
            if (errors['pattern'].requiredPattern === FormUtils.firstNamePattern || errors['pattern'].requiredPattern === FormUtils.lastNamePattern) {
              return `El ${inputName} no es válido`;
            }

          if(errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El correo electronico no es válido';
          }

          if(errors['pattern'].requiredPattern === FormUtils.notSpacesPattern) {
            return 'Este campo no puede contener espacios';
          }
          if (errors['pattern'].requiredPattern === FormUtils.phoneNumberPattern) {
            return 'El número de teléfono no es válido';
          }
          if (errors['pattern'].requiredPattern === FormUtils.cuitPattern) {
            return 'El CUIT no es válido';
          }
          if (errors['pattern'].requiredPattern === FormUtils.dniPattern) {
            return 'El DNI no es válido';
          }
          if (errors['pattern'].requiredPattern === FormUtils.datePattern) {
            return 'La fecha de nacimiento no es válida';
          }
          
          return 'Error de patrón contra expresión regular'

        case 'emailTaken':
          return 'El correo electrónico ya está siendo utilizado'

        case 'passwordMismatch':
          return 'Las contraseñas no coinciden';

        default:
          return `Error de validación no controlado ${key}`;

      }
    }
    return null;
  }

  static passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }

    const passwordsMatch = password.value === confirmPassword.value;


    if (!passwordsMatch) {
      confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {

      if (confirmPassword.errors?.['passwordMismatch']) {
        const { passwordMismatch, ...otherErrors } = confirmPassword.errors;
        const hasOtherErrors = Object.keys(otherErrors).length > 0;
        confirmPassword.setErrors(hasOtherErrors ? otherErrors : null);
      }
    return null;
    }
  }
}
