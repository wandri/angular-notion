import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  NgClass,
  NgComponentOutlet,
  NgOptimizedImage,
  NgStyle,
} from '@angular/common';
import { NotionContextService } from '../context.service';
import { normalizeUrl } from 'notion-utils';
import { PreviewImage } from 'notion-types/build/maps';

@Component({
  selector: 'an-lazy-image',
  standalone: true,
  imports: [NgClass, NgComponentOutlet, NgOptimizedImage, NgStyle],
  template: `
    @if (ctx.components().Image) {
      <ng-container
        *ngComponentOutlet="
          ctx.components().Image ?? null;
          inputs: previewImage().inputs
        "
      />
    } @else if (src()) {
      @if (fill()) {
        <img
          [ngSrc]="src()!"
          [alt]="alt()"
          [fill]="fill()"
          [ngStyle]="style()"
          [style.object-fit]="'cover'"
          [ngClass]="className()"
        />
      } @else {
        <img
          [src]="src()!"
          [alt]="alt()"
          [ngStyle]="style()"
          [ngClass]="className()"
          loading="lazy"
          decoding="async"
        />
      }
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnLazyImageComponent {
  readonly fill = input<boolean>(true);
  readonly src = input<string | undefined | null>(undefined);
  readonly alt = input<string | undefined>(undefined);
  readonly className = input<string>('');
  readonly style = input<Record<string, string> | null | undefined>(undefined);
  readonly height = input<number | string | undefined>(undefined);
  readonly priority = input<boolean>(false);
  private contextService = inject(NotionContextService);
  readonly ctx = this.contextService;
  readonly previewImage = computed<{
    preview: PreviewImage | null | undefined;
    inputs: Record<string, unknown>;
  }>(() => {
    const url = this.src();
    const preview =
      this.ctx.previewImages() && url
        ? (this.ctx.recordMap()?.preview_images?.[url] ??
          this.ctx.recordMap()?.preview_images?.[normalizeUrl(url)])
        : null;
    return {
      preview: preview,
      inputs: {
        src: this.src(),
        alt: this.alt(),
        style: this.style(),
        className: this.className(),
        width: preview?.originalWidth,
        height: preview?.originalHeight,
        blurDataURL: preview?.dataURIBase64,
        placeholder: 'blur',
        priority: this.priority(),
        onLoad: this.onLoad,
      },
    };
  });

  onLoad() {}
}
