import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay, tap } from 'rxjs';
import { STATUS_MAP, StatusConfig } from '../../contacts/contacts.utils';
import { SeeCancellationDialogComponent } from '../../contacts/dialogs/see-cancellation-dialog/see-cancellation-dialog.component';
import { AddDocumentDialogComponent } from '../../rents/dialogs/add-document-dialog/add-document-dialog.component';
import { CancelRentDialogComponent } from '../../rents/dialogs/cancel-rent-dialog/cancel-rent-dialog.component';
import { DeleteDocumentDialogComponent } from '../../rents/dialogs/delete-document-dialog/delete-document-dialog.component';
import { ProjectionDialogComponent } from '../../rents/dialogs/projection-dialog/projection-dialog.component';
import { UpdateContractDialogComponent } from '../../rents/dialogs/update-contract-dialog/update-contract-dialog.component';
import {
  RentDetail,
  RentDocument,
} from '../../rents/interfaces/rent-detail.interface';
import { RentService } from '../../rents/rents.service';
import { EntityDialogService } from '../../shared/services/entity-dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
import { QueryParamsService } from '../../shared/services/query-params.service';

@Component({
  selector: 'app-rent-details-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinner,
    MatListModule,
  ],
  templateUrl: './rent-details-page.component.html',
  styleUrl: './rent-details-page.component.css',
})
export class RentDetailsPageComponent {
  private _route = inject(ActivatedRoute);
  private _rentService = inject(RentService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);
  private _matDialog = inject(MatDialog);
  private _sanitizer = inject(DomSanitizer);
  private _entityDialogService = inject(EntityDialogService);
  private _queryParamsService = inject(QueryParamsService);

  documents!: RentDocument[];
  safePdfUrl!: SafeResourceUrl;
  showPdf = signal(true);
  isLoading = signal(true);
  isLoadingProjection = signal(false);

  rentDetails$ = this._rentService
    .getRentDetails(this._route.snapshot.params['rentId'])
    .pipe(
      tap((details) => {
        this.buildDocuments(details);
        this.isLoading.set(false);
      }),
      shareReplay(1),
    );

  issuerFullName = toSignal(
    this.rentDetails$.pipe(map((rent) => rent.tenantFullName)),
  );
  rentDate = toSignal(this.rentDetails$.pipe(map((rent) => rent.rentDate)));

  goBack() {
    this._router.navigate(['/owner-rents']);
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

  getStatusConfig(status: string): StatusConfig {
    return STATUS_MAP[status];
  }

  getStatusInfo(rent: RentDetail): string {
    if (
      rent.rentState === 'CANCELLED' &&
      rent.cancellationDate &&
      rent.cancellationReason
    ) {
      return `Cancelado el ${rent.cancellationDate.toString()}`;
    }

    if (rent.rentState === 'ACTIVE') {
      return `Fin del contrato: ${rent.rentDueDate.toString()}`;
    }

    if (rent.rentState === 'DONE') {
      return `Cumplido el ${rent.rentDueDate.toString()}`;
    }

    return '';
  }

  getStatusLabel(rent: RentDetail): string {
    if (rent.rentState === 'CANCELLED') {
      return 'Cancelado';
    }
    if (rent.rentState === 'ACTIVE') {
      return 'Activo';
    }
    if (rent.rentState === 'DONE') {
      return 'Cumplido';
    }
    return '';
  }

  seeCancellation(rent: RentDetail) {
    if (rent.rentState !== 'CANCELLED') return;
    this._matDialog.open(SeeCancellationDialogComponent, {
      panelClass: 'contact-dialog',
      backdropClass: 'dialog-backdrop',
      data: {
        title: 'Cancelación del contrato',
        cancellationDate: rent.cancellationDate,
        cancellationReason: rent.cancellationReason,
      },
    });
  }

  cancel() {
    this._entityDialogService
      .openActionsDialog(CancelRentDialogComponent, {
        panelClass: 'contact-dialog',
        entity: 'rent',
        action: 'cancel',
        backdropClass: 'dialog-backdrop',
        id: this._route.snapshot.params['rentId'],
        data: {
          rentId: this._route.snapshot.params['rentId'],
          issuerFullName: this.issuerFullName(),
          rentDate: this.rentDate(),
        },
      })
      .subscribe((changed: boolean) => {
        this._queryParamsService.clearQueryParams();
        if (changed) {
          window.location.reload();
        }
      });
  }

  seeProjection() {
    this.isLoadingProjection.set(true);
    this._rentService
      .getRentProjection(this._route.snapshot.params['rentId'])
      .subscribe({
        next: (projection) => {
          this.isLoadingProjection.set(false);
          this._matDialog.open(ProjectionDialogComponent, {
            data: projection,
            panelClass: 'projection-dialog',
            backdropClass: 'dialog-backdrop',
          });
        },
        error: () => {
          this._notificationService.error(
            'Ocurrió un error al calcular el aumento del alquiler',
          );
          this.isLoadingProjection.set(false);
        },
      });
  }

  addDocument() {
    this._entityDialogService
      .openNewEntityDialog(AddDocumentDialogComponent, {
        entity: 'document',
        panelClass: 'contact-dialog',
        backdropClass: 'dialog-backdrop',
        data: {
          rentId: this._route.snapshot.params['rentId'],
        },
      })
      .subscribe((changed: boolean) => {
        this._queryParamsService.clearQueryParams();
        if (changed) {
          window.location.reload();
        }
      });
  }

  updateContract() {
    this.rentDetails$.subscribe((rent) => {
      this._matDialog
        .open(UpdateContractDialogComponent, {
          panelClass: 'contact-dialog',
          backdropClass: 'dialog-backdrop',
          data: {
            rentId: this._route.snapshot.params['rentId'],
            currentContractName: 'Contrato',
          },
        })
        .afterClosed()
        .subscribe((updated: File) => {
          if (updated) {
            window.location.reload();
          }
        });
    });
  }

  toggleShowPdf() {
    this.showPdf.update((v) => !v);
  }

  buildDocuments(details: RentDetail) {
    const documents = details.extraDocuments;
    this.documents = [
      {
        documentId: 'contract',
        name: 'Contrato',
        content: details.contract,
      },
      ...documents,
    ];
    this.selectDocument('contract');
  }

  selectDocument(id: string) {
    this.documents.forEach((doc) => (doc.selected = false));
    const document = this.documents.find((d) => d.documentId === id);
    if (!document) return;
    document.selected = true;
    this.buildPdfURL(document.content);
  }

  deleteDocument(id: string) {
    const document = this.documents.find((d) => d.documentId === id);
    if (!document) return;

    this._matDialog
      .open(DeleteDocumentDialogComponent, {
        panelClass: 'contact-dialog',
        backdropClass: 'dialog-backdrop',
        data: {
          documentId: id,
          documentName: document.name,
        },
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.documents = this.documents.filter((doc) => doc.documentId !== id);
          if (this.documents.length > 0) {
            this.selectDocument(this.documents[0].documentId);
          }
        }
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
}
