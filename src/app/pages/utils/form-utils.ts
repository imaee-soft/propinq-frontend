import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormUtils {
  static firstNamePattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)?$";
  static lastNamePattern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)?$";
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static addressPattern = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.,#\\s]+$';
  static notSpacesPattern = '^\\S+$';
  static phoneNumberPattern = '^[0-9]{10}$';
  static cuitPattern = '^[0-9]{2}-[0-9]{8}-[0-9]$';
  static dniPattern = '^[0-9]{1,9}$';
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

   static errorMessages: {
    [key: string]: (error?: any, inputName?: string) => string
  } = {
    required: () => 'Este campo es requerido',
    minlength: (error) => `Debe ingresar al menos ${error.requiredLength} caracteres`,
    maxlength: (error) => `Debe ingresar como máximo ${error.requiredLength} caracteres`,
    min: (error) => `Este campo debe ser mayor o igual ${error.min}`,
    email: () => 'El correo no es válido',
    emailTaken: () => 'El correo electrónico ya está siendo utilizado',
    passwordMismatch: () => 'Las contraseñas no coinciden',
    pattern: (error, inputName) => {
      switch (error.requiredPattern) {
        case FormUtils.firstNamePattern:
        case FormUtils.lastNamePattern:
          return `El ${inputName} no es válido`;
        case FormUtils.emailPattern:
          return 'El correo electrónico no es válido';
        case FormUtils.notSpacesPattern:
          return 'Este campo no puede contener espacios';
        case FormUtils.phoneNumberPattern:
          return 'El número de teléfono no es válido';
        case FormUtils.cuitPattern:
          return 'El CUIT no es válido';
        case FormUtils.dniPattern:
          return 'El DNI no es válido';
        case FormUtils.datePattern:
          return 'La fecha de nacimiento no es válida';
        default:
          return 'Error de patrón contra expresión regular';
      }
    }
  };

  static getTextError(errors: ValidationErrors, inputName?: string):string | null {
    for (const key of Object.keys(errors)) {
      const handler = FormUtils.errorMessages[key];
      if (handler) {
        return handler(errors[key], inputName);
      }
      return `Error de validación no controlado ${key}`;
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

