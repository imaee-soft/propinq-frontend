import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {
  private phoneUtil = PhoneNumberUtil.getInstance();

  transform(value: string, region: string = 'AR'): string {
    if (!value) return '';
    try {
      const number = this.phoneUtil.parseAndKeepRawInput(value, region);
      return this.phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);
    } catch {
      return value;
    }
  }
}
