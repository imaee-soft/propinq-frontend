import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[appUppercase]' })
export class UppercaseDirective {
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;

    event.target.value = event.target.value.toUpperCase();
    event.target.setSelectionRange(start, end);

    const inputEvent = new Event('input', { bubbles: true });
    event.target.dispatchEvent(inputEvent);
  }
}
