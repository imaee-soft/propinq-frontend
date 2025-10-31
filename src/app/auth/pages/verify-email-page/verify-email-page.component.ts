import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY } from 'rxjs';
import { CustomSnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../../users/services/user.service';

@Component({
  selector: 'app-verify-email-page',
  imports: [MatIcon, RouterLink],
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private snackbarService = inject(CustomSnackbarService);

  maxResends = signal(3);
  resendCount = signal(0);
  email = signal<string>('');
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email.set(params['email'] || '');
    });
  }
  private executeResend = signal<string | null>(null);

  private resendResource = rxResource({
    request: () => this.executeResend(),
    loader: ({ request }) => {
      if (!request) return EMPTY;
      return this.userService.resendActivationEmail(request);
    },
  });

  onResendEmail() {
    this.resendCount.update((count) => count + 1);
    if (!this.email()) {
      this.snackbarService.show({
        message: 'No se pudo obtener el email registrado',
        type: 'error',
        duration: 5000,
        position: 'bottom-center',
      });
      return;
    }

    if (this.userService.isLoading()) {
      return;
    }

    if (this.resendCount() >= this.maxResends()) {
      this.snackbarService.show({
        message: 'Límite de reenvíos alcanzado',
        type: 'error',
        duration: 5000,
        position: 'bottom-center',
      });
      return;
    }

    this.executeResend.set(this.email());
  }

  constructor() {
    effect(() => {
      const result = this.resendResource.value();
      const request = this.executeResend();

      if (request && result !== undefined) {
        this.snackbarService.show({
          message: 'Email de verificación reenviado correctamente',
          type: 'success',
          duration: 5000,
          position: 'bottom-center',
        });
        this.executeResend.set(null);
      }
    });
  }
}
