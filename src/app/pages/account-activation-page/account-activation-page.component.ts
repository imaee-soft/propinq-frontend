import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../users/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-activation-page',
  imports: [RouterLink],
  templateUrl: './account-activation-page.component.html',
  styleUrls: ['./account-activation-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountActivationPageComponent implements OnInit, OnDestroy {
  userId = signal<string | null>(null);
  activationToken = signal<string | null>(null);
  canActivate = computed(() => !!this.userId() && !!this.activationToken());
  private userService = inject(UserService);
  private queryParamsSubscription?: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.userId.set(params['userId'] || null);
      this.activationToken.set(params['activationToken'] || null);
      // Puedes hacer un console.log aquí para revisar

      if (this.canActivate()) {
        const userId = this.userId();
        const activationToken = this.activationToken();
        if (userId && activationToken) {
          this.userService.activateUser(userId, activationToken).subscribe();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.userId.set(null);
    this.activationToken.set(null);
    this.queryParamsSubscription?.unsubscribe();
  }
}
