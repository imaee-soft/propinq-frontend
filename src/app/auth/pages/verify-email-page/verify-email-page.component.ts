import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CustomSnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../../users/services/user.service';

@Component({
  selector: 'app-verify-email-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private snackbarService = inject(CustomSnackbarService);

  resendForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = signal(false);
  resendCount = signal(0);
  maxResends = signal(3);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const email = params['email'] || '';

      if (email) {
        this.resendForm.patchValue({ email });
      }
    });
  }

  onResendEmail() {
    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) {
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

    const email = this.resendForm.value.email?.trim();
    if (!email) {
      this.snackbarService.show({
        message: 'No se pudo obtener el email registrado',
        type: 'error',
        duration: 5000,
        position: 'bottom-center',
      });
      return;
    }

    this.isLoading.set(true);
    this.resendCount.update((count) => count + 1);
    this.userService
      .resendActivationEmail(email)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.snackbarService.show({
            message: 'Código enviado correctamente',
            type: 'success',
            duration: 5000,
            position: 'bottom-center',
          });

          this.router.navigate(['/auth/activate'], {
            queryParams: { email },
          });
        },
        error: (error) => {
          console.error('Error reenviando email:', error);
        },
      });
  }
}
