import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-svg-empty-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    <svg viewBox="0 0 14 14" [ngClass]="className()" width="14">
      <path
        d="M11.0918,0 C11.5383,0 11.9307,0.295898 12.0533,0.725586 L13.9615,7.40332 C13.9871,7.49316 14,7.58594 14,7.67871 L14,13 C14,13.5527 13.5522,14 13,14 L1,14 C0.447754,14 0,13.5527 0,13 L0,7.67871 C0,7.58594 0.0129395,7.49316 0.0384521,7.40332 L1.94666,0.725586 C2.06934,0.295898 2.46167,0 2.9082,0 L11.0918,0 Z M4.27271,1.5 C3.83728,1.5 3.45178,1.78223 3.31982,2.19727 L1.91455,6.61328 C1.70947,7.25879 2.1908,7.91699 2.86755,7.91699 L4.70837,7.91699 C4.70837,8.93652 5.16663,10.168 7,10.168 C8.83337,10.168 9.29163,8.93652 9.29163,7.91699 L11.1478,7.89355 C11.8201,7.88477 12.2927,7.22852 12.0876,6.58887 L10.681,2.19531 C10.5485,1.78125 10.1635,1.5 9.72864,1.5 L4.27271,1.5 Z"
      ></path>
    </svg>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnSvgEmptyComponent {
  readonly className = input<string>('');
}
