import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'an-asset-wrapper',
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
export class AnAssetWrapperComponent {}
