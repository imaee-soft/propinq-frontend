import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { QueryParamsService } from '../../shared/services/query-params.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { isAuthRoute } from '../../shared/utils/auth-route.util';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, FooterComponent, SidebarComponent, RouterOutlet],
  templateUrl: 'app-layout.component.html',
  styleUrls: ['app-layout.component.css'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  actualPath = signal('');
  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private queryParamsService: QueryParamsService
  ) {}

  ngOnInit() {
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.actualPath.set(event.urlAfterRedirects);
      });
    this.actualPath.set(this.router.url);
    this.queryParamsService.clearQueryParams();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  authLayout = computed(() => isAuthRoute(this.actualPath()));
  appLayout = computed(() => !isAuthRoute(this.actualPath()));
}
