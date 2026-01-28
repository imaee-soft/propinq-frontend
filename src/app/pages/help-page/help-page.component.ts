import { Component, signal } from "@angular/core";

@Component({
  imports: [],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css',
})
export class HelpPageComponent {
  readonly accordionCount = 4;

  openIndexes = signal<number[]>([]);

  toggleAccordion(idx: number) {
    this.openIndexes.update(opened =>
      opened.includes(idx)
        ? opened.filter(i => i !== idx)
        : [...opened, idx]
    );
  }

  isOpen(idx: number) {
    return this.openIndexes().includes(idx);
  }
}

