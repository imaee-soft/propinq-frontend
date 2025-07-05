import { FormGroup, ValidationErrors } from "@angular/forms";

export class FormUtils {
  static firstNamePattern = '^[a-zA-Z]+( [a-zA-Z]+)?$';
  static lastNamePattern = '^[a-zA-Z]+( [a-zA-Z]+)?$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notSpacesPattern = '^\\S+$';
  static phoneNumberPattern = '^[0-9]{10}$';
  static cuitPattern = '^[0-9]{2}-[0-9]{8}-[0-9]$';


  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      // si el form tiene errores y fue tocado
      // la doble negación !! convierte el valor en un booleano
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

    static getFieldError(form: FormGroup, fieldName: string, inputName?: string): string | null {
    if (!form.controls[fieldName]) return null; // si el campo no existe, retornamos null

    const errors = form.controls[fieldName].errors ?? {}; //

    return FormUtils.getTextError(errors, inputName);
  }

    static getTextError(errors: ValidationErrors, inputName?: string):string | null {
    console.log(errors)
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Este campo debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

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

          return 'Error de patrón contra expresión regular'

        case 'emailTaken':
          return 'El correo electrónico ya está siendo utilizado'

        default:
          return `Error de validación no controlado ${key}`;

      }
    }
    return null;
  }


}
