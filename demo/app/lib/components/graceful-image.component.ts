import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'an-graceful-image',
  standalone: true,
  imports: [NgClass, NgOptimizedImage],
  template: `
    @if (src()) {
      <div [ngClass]="className()">
        <img
          [src]="src()!"
          [alt]="alt()"
          [ngClass]="className()"
          loading="lazy"
        />
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnGracefulImageComponent {
  readonly src = input.required<string | undefined>();
  readonly alt = input<string | undefined>(undefined);
  readonly loading = input<string | undefined>(undefined);
  readonly className = input<string>('');
  readonly ctx = inject(NotionContextService);
}
