import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-wall-page',
  imports: [RouterLink],
  templateUrl: './auth-wall-page.component.html',
  styleUrl: './auth-wall-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthWallPageComponent { }
