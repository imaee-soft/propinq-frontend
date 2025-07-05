import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  template: `<p>user works!</p>`,
  styleUrl: './user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent { }
