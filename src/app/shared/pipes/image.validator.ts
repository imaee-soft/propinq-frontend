import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ImageValidator {
  static maxSize(maxSizeInBytes: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value as File[];
      if (!files || files.length === 0) return null;

      const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);

      if (oversizedFiles.length > 0) {
        return {
          maxSize: {
            maxSize: maxSizeInBytes,
            actualSize: Math.max(...oversizedFiles.map((f) => f.size)),
            maxSizeMB: (maxSizeInBytes / (1024 * 1024)).toFixed(2),
            oversizedFiles: oversizedFiles.map((f) => ({
              name: f.name,
              size: f.size,
              sizeMB: (f.size / (1024 * 1024)).toFixed(2),
            })),
          },
        };
      }

      return null;
    };
  }

  static allowedTypes(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value as File[];
      if (!files || files.length === 0) return null;

      const normalizedAllowedTypes = allowedTypes.map((type) =>
        type.toLowerCase()
      );
      const invalidFiles = files.filter((file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return (
          !fileExtension || !normalizedAllowedTypes.includes(fileExtension)
        );
      });

      if (invalidFiles.length > 0)
        return {
          allowedTypes: {
            allowedTypes: allowedTypes,
            invalidFiles: invalidFiles.map((f) => ({
              name: f.name,
              type: f.name.split('.').pop()?.toLowerCase() || 'unknown',
            })),
          },
        };

      return null;
    };
  }
}
