import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-collection-view-list-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path
        d="M12 1.5H2a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V2a.5.5 0 00-.5-.5zM2 0h10a2 2 0 012 2v10a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm1 3h6v1.5H3V3zm0 2.5h8V7H3V5.5zM3 8h4v1.5H3V8z"
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
export class AnSvgCollectionViewListIconComponent {
  readonly className = input<string>('');
}
