import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'an-pdf',
  imports: [],
  template: `
    @if (file() && isBrowser) {
      <!--      <pdf-viewer-->
      <!--        [src]="file()"-->
      <!--        [render-text]="true"-->
      <!--        [original-size]="false"-->
      <!--        [ngClass]="className()"-->
      <!--      />-->
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPdfComponent {
  readonly file = input.required<string>();
  readonly className = input<string>('');
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
}
