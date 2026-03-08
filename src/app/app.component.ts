import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconService } from './shared/services/icons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule],
})
export class AppComponent {
  constructor(iconService: IconService) {}
}
