import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(
    private _matIconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
  ) {
    this._matIconRegistry.addSvgIcon(
      'whatsapp',
      this._sanitizer.bypassSecurityTrustResourceUrl('/whatsapp.svg'),
    );
  }
}
