import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { QueryParamsService } from '../../shared/services/query-params.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';

const SIGNUP_PATH = '/signup';
const LOGIN_PATH = '/login';
const VERIFY_EMAIL_PATH = '/auth/verify-email';
const ACTIVATE_PATH_PREFIX = '/auth/activate';

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

  authLayout = computed(
    () =>
      this.isSignup() ||
      this.isLogin() ||
      this.isVerifyEmail() ||
      this.isActivate()
  );
  appLayout = computed(
    () =>
      !this.isSignup() &&
      !this.isLogin() &&
      !this.isVerifyEmail() &&
      !this.isActivate()
  );

  readonly SIGNUP_PATH = '/signup';
  readonly LOGIN_PATH = '/login';
  readonly VERIFY_EMAIL_PATH = '/auth/verify-email';
  readonly ACTIVATE_PATH_PREFIX = '/auth/activate';

  isSignup(): boolean {
    return this.actualPath() === SIGNUP_PATH;
  }

  isLogin(): boolean {
    return this.actualPath() === LOGIN_PATH;
  }

  isVerifyEmail(): boolean {
    return this.actualPath() === VERIFY_EMAIL_PATH;
  }

  isActivate(): boolean {
    return this.actualPath().startsWith(ACTIVATE_PATH_PREFIX);
  }
}
