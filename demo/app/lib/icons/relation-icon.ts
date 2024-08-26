import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-relation-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path d="M4.5 1v2h5.086L1 11.586 2.414 13 11 4.414V9.5h2V1z" />
    </svg>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnSvgRelationComponent {
  readonly className = input<string>('');
}
