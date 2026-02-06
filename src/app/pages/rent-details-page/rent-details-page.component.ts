import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { RentService } from '../../rents/rents.service';

@Component({
  selector: 'app-rent-details-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinner,
  ],
  templateUrl: './rent-details-page.component.html',
  styleUrl: './rent-details-page.component.css',
})
export class RentDetailsPageComponent {
  private _route = inject(ActivatedRoute);
  private _rentService = inject(RentService);
  private _router = inject(Router);
  private _sanitizer = inject(DomSanitizer);

  safePdfUrl!: SafeResourceUrl;
  showPdf = signal(true);
  isLoading = signal(true);

  rentDetails$ = this._rentService
    .getRentDetails(this._route.snapshot.params['rentId'])
    .pipe(
      tap((details) => {
        this.buildPdfURL(details.contract);
        this.isLoading.set(false);
      }),
      shareReplay(1),
    );

  goBack() {
    window.history.back();
  }

  goToProperty() {
    this.rentDetails$.subscribe((rent) => {
      const url = this._router.createUrlTree(['/properties', rent.propertyId]);
      window.open(url.toString(), '_blank');
    });
  }

  goToContact() {
    this.rentDetails$.subscribe((rent) => {
      const url = this._router.createUrlTree([
        '/contact-details',
        rent.contactId,
      ]);
      window.open(url.toString(), '_blank');
    });
  }

  buildPdfURL(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([new Uint8Array(byteNumbers)], {
      type: 'application/pdf',
    });
    const url = URL.createObjectURL(blob);
    this.safePdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleShowPdf() {
    this.showPdf.update((v) => !v);
  }
}
