import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';

@Component({
  selector: 'an-graceful-image',
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
export class AnGracefulImageComponent {
  readonly src = input<string | undefined>(undefined);
  readonly alt = input<string | undefined>(undefined);
  readonly className = input<string>('');
  readonly ctx = inject(NotionContextService);
}
