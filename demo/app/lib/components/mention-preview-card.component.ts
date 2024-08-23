import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'an-mention-preview-card',
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
export class AnMentionPreviewCardComponent {}
