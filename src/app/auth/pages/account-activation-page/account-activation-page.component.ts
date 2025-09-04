import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../../users/services/user.service';
import { Subscription } from 'rxjs';
import { QueryParamsService } from '../../../shared/services/query-params.service';

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

  userId = computed(() => this.queryParamsService.queryParams()?.['userId'] || null);
  activationToken = computed(() => this.queryParamsService.queryParams()?.['activationToken'] || null);

  constructor() {
    effect(() => {
      const userId = this.userId();
      const activationToken = this.activationToken();
      if (userId && activationToken) {
        this.userService.activateUser(userId, activationToken).subscribe();
      }
    });
  }
}
