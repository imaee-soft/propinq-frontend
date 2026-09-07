import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
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

  private activationRequested = signal(false);

  status = signal<ActivationStatus>('idle');
  errorMessage = signal('No se pudo activar la cuenta. El enlace puede estar vencido o ser inválido.');

  userId = computed(() => this.queryParamsService.queryParams()?.['userId'] || null);
  activationToken = computed(() => this.queryParamsService.queryParams()?.['activationToken'] || null);

  constructor() {
    effect(() => {
      const userId = this.userId();
      const activationToken = this.activationToken();

      if (!userId || !activationToken || this.activationRequested()) {
        return;
      }

      this.activationRequested.set(true);
      this.status.set('loading');

      this.userService.activateUser(userId, activationToken).subscribe({
        next: () => this.status.set('success'),
        error: (err) => {
          const apiMessage = err?.error?.message || err?.error?.detail;
          if (typeof apiMessage === 'string' && apiMessage.trim()) {
            this.errorMessage.set(apiMessage);
          }
          this.status.set('error');
        },
      });
    });
  }
}
