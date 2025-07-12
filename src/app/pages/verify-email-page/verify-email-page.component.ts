import { UserService } from './../../../users/services/user.service';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from "@angular/core";
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
  styleUrls: ['./verify-email-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  maxResends = signal(3);
  resendCount = signal(0);
  email = signal<string>('');
  ngOnInit(){
    const navigation = this.router.getCurrentNavigation();
    this.email.set(navigation?.extras.state?.['email'] || '');
  }
  private executeResend = signal<string | null>(null);

    private resendResource = rxResource({
    request: () => this.executeResend(),
    loader: ({ request }) => {
      if (!request) return EMPTY;
      return this.userService.resendActivationEmail(request);
    }
  });

  onResendEmail() {
    this.resendCount.update(count => count + 1);
    if (!this.email()) {
      this.snackBar.open('No se pudo obtener el email registrado', 'Cerrar', { duration: 5000 });
      return;
    }

    if (this.userService.isLoading()) {
      return;
    }

    if (this.resendCount() >= this.maxResends()) {
      this.snackBar.open('Límite de reenvíos alcanzado', 'Cerrar', { duration: 5000 });
      return;
    }

    this.executeResend.set(this.email());
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

