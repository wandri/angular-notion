import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-rurl-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path
        d="M3.733 3.867h3.734c1.03 0 1.866.837 1.866 1.866 0 1.03-.837 1.867-1.866 1.867h-.934a.934.934 0 000 1.867h.934a3.734 3.734 0 000-7.467H3.733A3.73 3.73 0 001.89 8.977a4.637 4.637 0 01.314-2.18 1.854 1.854 0 01-.336-1.064c0-1.03.837-1.866 1.866-1.866zm8.377 1.422a4.6 4.6 0 01-.316 2.176c.212.303.34.67.34 1.068 0 1.03-.838 1.867-1.867 1.867H6.533a1.869 1.869 0 01-1.866-1.867c0-1.03.837-1.866 1.866-1.866h.934a.934.934 0 000-1.867h-.934a3.733 3.733 0 000 7.467h3.734a3.73 3.73 0 001.843-6.978z"
      />
    </svg>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnSvgUrlComponent {
  readonly className = input<string>('');
}
