import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css',
})
export class HelpPageComponent {
  readonly accordionCount = 4;

  openIndexes = signal<number[]>([]);

  goBack() {
    window.history.back();
  }

  toggleAccordion(idx: number) {
    this.openIndexes.update((opened) =>
      opened.includes(idx) ? opened.filter((i) => i !== idx) : [...opened, idx],
    );
  }

  isOpen(idx: number) {
    return this.openIndexes().includes(idx);
  }
}
