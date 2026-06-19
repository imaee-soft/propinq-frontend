import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
  selector: 'app-account-activation-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './account-activation-page.component.html',
  styleUrls: ['./account-activation-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountActivationPageComponent implements OnInit, AfterViewInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private snackbarService = inject(CustomSnackbarService);

  @ViewChild('codeInput') codeInput: any;

  activationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    activationToken: ['', [Validators.required]],
  });

  isLoading = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const email = params['email'] || '';
      const activationToken = params['activationToken'] || '';

      if (email) {
        this.activationForm.patchValue({ email });
      }

      if (activationToken) {
        this.activationForm.patchValue({ activationToken });
      }
    });
  }

  ngAfterViewInit() {
    // Auto-focus on activation code input for better UX
    if (this.codeInput) {
      this.codeInput.nativeElement.focus();
    }
  }

  onActivate() {
    if (this.activationForm.invalid || this.isLoading()) {
      this.activationForm.markAllAsTouched();
      return;
    }

    const email = this.activationForm.value.email?.trim();
    const activationToken = this.activationForm.value.activationToken?.trim();

    if (!email || !activationToken) {
      return;
    }

    this.isLoading.set(true);
    this.userService
      .activateUser(email, activationToken)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.snackbarService.show({
            message: 'Cuenta activada exitosamente',
            type: 'success',
            duration: 5000,
            position: 'bottom-center',
          });
          this.router.navigateByUrl('/auth/login');
        },
        error: () => {
          // El interceptor global ya muestra la notificación de error
        },
      });
  }
}
