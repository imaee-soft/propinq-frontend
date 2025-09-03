import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: 'dynamic-input.component.html',
  styleUrls: ['dynamic-input.component.css'],
  imports: [MatDatepickerModule, MatInput, MatIcon, ReactiveFormsModule],
})
export class DynamicInputComponent implements AfterViewInit {
  inputElement =
    viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  initialValue = input<string>();
  submittedValue = output<string | null>();

  valueFormControl = new FormControl(this.initialValue());

  ngAfterViewInit(): void {
    this.valueFormControl.setValue(this.initialValue());
    setTimeout(() => {
      const input = this.inputElement().nativeElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  onSubmit() {
    const newValue = this.valueFormControl.value;
    if (newValue) this.submittedValue.emit(newValue);
  }

  onClose() {
    this.submittedValue.emit(null);
  }
}
