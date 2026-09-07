import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface RuntimeConfig {
  mapPoisEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private _config: RuntimeConfig | null = null;

  async load(): Promise<void> {
    try {
      const response = await fetch('/assets/runtime-config.json', {
        cache: 'no-store',
      });
      if (response.ok) {
        this._config = await response.json();
      }
    } catch {
      // Sin runtime-config (p. ej. ng serve sin assets): usar environment.
    }
  }

  get mapPoisEnabled(): boolean {
    return this._config?.mapPoisEnabled ?? environment.mapPoisEnabled;
  }
}
