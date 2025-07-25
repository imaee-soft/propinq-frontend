import { Component, OnDestroy, OnInit, Signal, computed, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [ NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: 'app-layout.component.html',
  styleUrl: 'app-layout.component.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  actualPath = signal('');
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.actualPath.set(event.urlAfterRedirects);
      });
    this.actualPath.set(this.router.url);
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  authLayout = computed(() => this.isSignup() || this.isLogin() || this.isVerifyEmail || this.isActivate())

  appLayout = computed(() => !this.isSignup() && !this.isLogin() && !this.isVerifyEmail() && !this.isActivate());
  
  readonly SIGNUP_PATH = '/signup';
  readonly LOGIN_PATH = '/login';
  readonly VERIFY_EMAIL_PATH = '/auth/verify-email';
  readonly ACTIVATE_PATH_PREFIX = '/auth/activate';

  isSignup(): boolean {
    return this.actualPath() === this.SIGNUP_PATH;
  }

  isLogin(): boolean {
    return this.actualPath() === this.LOGIN_PATH;
  }

  isVerifyEmail(): boolean {
    return this.actualPath() === this.VERIFY_EMAIL_PATH;
  }

  isActivate(): boolean {
    return this.actualPath().startsWith(this.ACTIVATE_PATH_PREFIX);
  }
}
