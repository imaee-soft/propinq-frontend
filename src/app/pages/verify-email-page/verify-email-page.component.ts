import { UserService } from './../../../users/services/user.service';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { rxResource } from "@angular/core/rxjs-interop";
import { EMPTY} from "rxjs";

@Component({
  selector: 'app-verify-email-page',
  imports: [MatIcon, RouterLink],
  templateUrl: './verify-email-page.component.html',
  styleUrl: './verify-email-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);

  private executeResend = signal<string | null>(null);

    private resendResource = rxResource({
    request: () => this.executeResend(),
    loader: ({ request }) => {
      if (!request) return EMPTY;
      return this.userService.resendActivationEmail(request);
    }
  });

  onResendEmail() {
    const email = this.authService.getUserFromLocalStorage()?.email || null;

    if (!email) {
      this.snackBar.open('No se pudo obtener el email registrado', 'Cerrar', { duration: 5000 });
      return;
    }

    if (this.userService.isLoading()) {
      return;
    }

    this.executeResend.set(email);
  }


  constructor() {
    effect(() => {
      const result = this.resendResource.value();
      const request = this.executeResend();

      if (request && result !== undefined) {
        this.snackBar.open('Email de activación reenviado', 'Cerrar', { duration: 5000 });
        this.executeResend.set(null);
      }
    });
  }
}

