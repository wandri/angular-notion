import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-collection-view-board-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path
        d="M12 1.5H2a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V2a.5.5 0 00-.5-.5zM2 0h10a2 2 0 012 2v10a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm1 3h2v6H3V3zm3 0h2v8H6V3zm3 0h2v4H9V3z"
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
export class AnSvgCollectionViewBoardIconComponent {
  readonly className = input<string>('');
}
