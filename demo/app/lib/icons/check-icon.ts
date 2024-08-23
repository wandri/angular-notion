import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'an-svg-check-icon',
  standalone: true,
  imports: [],
  template: `
    <svg viewBox="0 0 14 14">
      <path d="M5.5 12L14 3.5 12.5 2l-7 7-4-4.003L0 6.499z" />
    </svg>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnSvgCheckComponent {}
