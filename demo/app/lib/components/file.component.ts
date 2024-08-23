import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'an-file',
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
export class AnFileComponent {}
