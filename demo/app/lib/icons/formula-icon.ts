import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-formula-icon',
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path
        d="M7.779 7.063l-3.157 4.224a.49.49 0 00-.072.218.35.35 0 00.346.357h6.242c.476 0 .862.398.862.889v.36c0 .491-.386.889-.862.889H1.862A.876.876 0 011 13.111v-.425a.82.82 0 01.177-.54L4.393 7.8a1.367 1.367 0 00-.006-1.625L1.4 2.194a.822.822 0 01-.18-.544V.89C1.22.398 1.604 0 2.08 0h8.838c.476 0 .861.398.861.889v.36c0 .491-.385.89-.86.89H5.135c-.19 0-.345.159-.345.356a.489.489 0 00.07.216l2.92 3.975c.049.062.063.107.06.188a.246.246 0 01-.062.189z"
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
export class AnSvgFormulaComponent {
  readonly className = input<string>('');
}
