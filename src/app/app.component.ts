import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { IconService } from './shared/services/icons.service';
import {
  isAuthRoute,
  syncRecaptchaBadgeForRoute,
} from './shared/utils/auth-route.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule],
})
export class AppComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private routerSub?: Subscription;

  constructor(iconService: IconService) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        syncRecaptchaBadgeForRoute(isAuthRoute(event.urlAfterRedirects));
      });

    syncRecaptchaBadgeForRoute(isAuthRoute(this.router.url));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
