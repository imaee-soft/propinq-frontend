import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: 'dynamic-input.component.html',
  styleUrls: ['dynamic-input.component.css'],
  imports: [MatInputModule, MatIcon],
})
export class DynamicInputComponent implements AfterViewInit {
  inputElement =
    viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  value = input<string>('');
  submittedValue = output<string | null>();

  ngAfterViewInit(): void {
    setTimeout(() => {
      const input = this.inputElement().nativeElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  onSubmit(newValue: string) {
    this.submittedValue.emit(newValue);
  }

  onClose() {
    this.submittedValue.emit(null);
  }
}
