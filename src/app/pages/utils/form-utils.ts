export class FormUtils {
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notSpacesPattern = '^\\S+$';
  static phoneNumberPattern = '^[0-9]{10}$';
  static cuitPattern = '^[0-9]{2}-[0-9]{8}-[0-9]$';
}
