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

  isSignup(): boolean {
    return this.actualPath() === '/signup';
  }

  isLogin(): boolean {
    return this.actualPath() === '/login';
  }

  isAccountActivation(): boolean {
    return this.actualPath() === '/account-activation';
  }
}
