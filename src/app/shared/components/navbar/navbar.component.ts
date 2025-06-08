import { Component, HostListener, input, signal } from '@angular/core';
import { NavElement } from '../../interfaces/nav-element.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  navElements = input<NavElement[]>([]);
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.pageYOffset > 10);
  }
}
