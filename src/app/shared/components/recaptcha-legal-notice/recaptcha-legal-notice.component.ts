import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-recaptcha-legal-notice',
  standalone: true,
  templateUrl: './recaptcha-legal-notice.component.html',
  styleUrls: ['./recaptcha-legal-notice.component.css'],
})
export class RecaptchaLegalNoticeComponent {
  readonly visible = environment.reCAPTCHA_enabled === true;
}
