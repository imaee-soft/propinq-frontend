import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-register-page',
  imports: [],
  template: `<p>register-page works!</p>`,
  styleUrl: './register-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent { }
