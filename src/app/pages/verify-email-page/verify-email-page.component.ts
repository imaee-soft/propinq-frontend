import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { rxResource } from "@angular/core/rxjs-interop";
import { EMPTY} from "rxjs";

@Component({
  selector: 'app-verify-email-page',
  imports: [MatIcon],
  templateUrl: './verify-email-page.component.html',
  styleUrl: './verify-email-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private executeResend = signal<string | null>(null);
  resendAttempts = signal(0);
  private maxResendAttempts = signal(3);
  canResend = signal(true);
  countdown = signal(0);

    private resendResource = rxResource({
    request: () => this.executeResend(),
    loader: ({ request }) => {
      if (!request) return EMPTY;
      return this.authService.resendActivationEmail(request);
    }
  });

  onResendEmail() {
    const email = this.authService.getUserFromLocalStorage()?.email || null;

    if (!email) {
      this.snackBar.open('No se pudo obtener el email registrado', 'Cerrar', { duration: 5000 });
      return;
    }

    if (this.resendAttempts() >= this.maxResendAttempts()) {
      this.snackBar.open('Has alcanzado el límite de reenvíos', 'Cerrar', { duration: 5000 });
      return;
    }

    if (this.authService.isLoading()) {
      return;
    }

    this.executeResend.set(email);
  }


  constructor() {
    effect(() => {
      const result = this.resendResource.value();
      const request = this.executeResend();

      if (result?.success && request) {
        this.resendAttempts.update(count => count + 1);
        this.snackBar.open('Email de activación reenviado', 'Cerrar', { duration: 5000 });
        this.executeResend.set(null);
      }
    });
  }
}

