import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../users/services/user.service';
import { QueryParamsService } from '../../../shared/services/query-params.service';

type ActivationStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-account-activation-page',
  imports: [RouterLink],
  templateUrl: './account-activation-page.component.html',
  styleUrls: ['./account-activation-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountActivationPageComponent {
  private userService = inject(UserService);
  private queryParamsService = inject(QueryParamsService);

  userId = computed(
    () => this.queryParamsService.queryParams()?.['userId'] || null,
  );
  activationToken = computed(
    () => this.queryParamsService.queryParams()?.['activationToken'] || null,
  );

  status = signal<ActivationStatus>('idle');
  errorMessage = signal(
    'El enlace de activación no es válido o ya expiró. Solicitá uno nuevo o contactá soporte.',
  );

  constructor() {
    effect(() => {
      const userId = this.userId();
      const activationToken = this.activationToken();
      if (!userId || !activationToken) {
        this.status.set('error');
        return;
      }

      this.status.set('loading');
      this.userService.activateUser(userId, activationToken).subscribe({
        next: () => this.status.set('success'),
        error: () => {
          this.status.set('error');
          this.errorMessage.set(
            'No pudimos activar tu cuenta. El enlace puede haber expirado o ya fue utilizado.',
          );
        },
      });
    });
  }
}
