import { Injectable } from '@angular/core';

export interface RuntimeConfig {
  mapPoisEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private _mapPoisEnabled = false;

  async load(): Promise<void> {
    try {
      const response = await fetch('/assets/runtime-config.json', {
        cache: 'no-store',
      });
      if (response.ok) {
        const config: RuntimeConfig = await response.json();
        this._mapPoisEnabled = config.mapPoisEnabled === true;
      }
    } catch {
      // Sin runtime-config: POIs desactivados (MAP_POIS_ENABLED=false por defecto).
    }
  }

  get mapPoisEnabled(): boolean {
    return this._mapPoisEnabled;
  }
}
