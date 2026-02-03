import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ReportsEmbedService } from '../../shared/services/reports-embed.service';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css'],
  standalone: true,
  imports: [MatIconModule],
})
export class ReportsPageComponent {
  private embedService = inject(ReportsEmbedService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);

  // Signal con el usuario logueado
  readonly user = this.authService.user;

  // Signal para parámetros de filtro
  readonly filters = computed(() => {
    const email = this.user()?.username ?? null;

    if (!email) {
      return undefined;
    }
    return { email };
  });

  readonly reportsResource = rxResource({
    request: () => {
      const filters = this.filters();
      // Solo ejecuta si hay filtros válidos
      if (filters)
        return this.embedService.getEmbedUrl('dashboard', 2, filters);
      return of(null);
    },
    loader: ({ request }) => request,
  });

  readonly metabaseIframeUrl = computed<SafeResourceUrl | null>(() => {
    const result = this.reportsResource.value();
    return result && result.iframeUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(result.iframeUrl)
      : null;
  });

  readonly isLoading = computed(() => this.reportsResource.isLoading());
  readonly error = computed(() =>
    this.reportsResource.error() && !this.isLoading()
      ? '¡Ups! Ha ocurrido un error al cargar los reportes.'
      : null,
  );

  goBack() {
    window.history.back();
  }
}
