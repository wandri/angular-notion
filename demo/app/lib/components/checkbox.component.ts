import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AnSvgCheckComponent } from '../icons/check-icon';

@Component({
  selector: 'an-checkbox',
  standalone: true,
  imports: [AnSvgCheckComponent],
  template: ` <span class="notion-property notion-property-checkbox">
    @if (isChecked()) {
      <div class="notion-property-checkbox-checked">
        <an-svg-check-icon />
      </div>
    } @else {
      <div class="notion-property-checkbox-unchecked"></div>
    }
  </span>`,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCheckboxComponent {
  readonly isChecked = input<boolean>(false);
  readonly blockId = input<string | undefined>();
}
