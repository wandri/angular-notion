import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'an-page-aside',
  standalone: true,
  imports: [],
  template: ``,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPageAsideComponent {}
