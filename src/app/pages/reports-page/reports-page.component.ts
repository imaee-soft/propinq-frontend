import { Component, computed, inject, OnDestroy } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/services/auth.service';
import { ReportsEmbedService } from '../../shared/services/reports-embed.service';

type IFrameResizeFn = (
  options: { checkOrigin?: boolean | string[]; log?: boolean },
  iframe: HTMLIFrameElement,
) => void;

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css'],
  standalone: true,
  imports: [MatIconModule],
})
export class ReportsPageComponent implements OnDestroy {
  private embedService = inject(ReportsEmbedService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);
  private resizerScriptId = 'metabase-iframe-resizer';
  private resizerLoaded = false;

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
        return this.embedService.getEmbedUrl(
          'dashboard',
          environment.metabaseDashboardId,
          filters,
        );
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

  onIframeLoad(iframe: HTMLIFrameElement): void {
    const iframeUrl = this.reportsResource.value()?.iframeUrl;
    if (!iframeUrl) {
      return;
    }

    const metabaseOrigin = new URL(iframeUrl).origin;
    this.loadIframeResizer(metabaseOrigin, () => {
      const iFrameResize = (window as Window & { iFrameResize?: IFrameResizeFn })
        .iFrameResize;
      if (!iFrameResize) {
        return;
      }

      iFrameResize(
        {
          checkOrigin: [metabaseOrigin, window.location.origin],
          log: false,
        },
        iframe,
      );
    });
  }

  ngOnDestroy(): void {
    const iframe = document.querySelector<HTMLIFrameElement>('.metabase-iframe');
    if (iframe) {
      iframe.removeAttribute('style');
    }
  }

  private loadIframeResizer(
    metabaseOrigin: string,
    onReady: () => void,
  ): void {
    if (this.resizerLoaded && (window as Window & { iFrameResize?: IFrameResizeFn }).iFrameResize) {
      onReady();
      return;
    }

    const existing = document.getElementById(this.resizerScriptId);
    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      if ((window as Window & { iFrameResize?: IFrameResizeFn }).iFrameResize) {
        onReady();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = this.resizerScriptId;
    script.src = `${metabaseOrigin}/app/iframeResizer.js`;
    script.async = true;
    script.onload = () => {
      this.resizerLoaded = true;
      onReady();
    };
    document.body.appendChild(script);
  }
}
