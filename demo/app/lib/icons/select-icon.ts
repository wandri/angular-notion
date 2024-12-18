import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-select-icon',
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path
        d="M7 13A6 6 0 107 1a6 6 0 000 12zM3.751 5.323A.2.2 0 013.909 5h6.182a.2.2 0 01.158.323L7.158 9.297a.2.2 0 01-.316 0L3.751 5.323z"
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
export class AnSvgSelectComponent {
  readonly className = input<string>('');
}
