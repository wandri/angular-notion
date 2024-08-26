import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-person-2-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()">
      <path
        d="M13.125 10.035c-.571-.55-2.324-1.504-3.5-2.16v-.834c.224-.322.42-.671.566-1.055.394-.242.746-.702.746-1.173 0-.458-.005-.87-.47-1.208C10.305 1.558 9.436 0 7 0S3.695 1.558 3.533 3.605c-.465.338-.47.75-.47 1.208 0 .471.352.93.746 1.173.146.384.342.733.566 1.055v.834c-1.176.656-2.929 1.61-3.5 2.16C.165 10.72 0 11.812 0 14h14c0-2.188-.164-3.281-.875-3.965z"
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
export class AnSvgPerson2Component {
  readonly className = input<string>('');
}
