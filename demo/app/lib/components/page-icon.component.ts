import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block, CalloutBlock, PageBlock } from 'notion-types';
import { NgClass } from '@angular/common';
import { getBlockIcon, getBlockTitle, isUrl } from 'notion-utils';
import { AnLazyImageComponent } from './lazy-image.component';
import { AnDefaultPageIconComponent } from './default-page-icon.component';

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  );
};

@Component({
  selector: 'an-page-icon',
  imports: [NgClass, AnLazyImageComponent, AnDefaultPageIconComponent],
  template: `
    <div
      [ngClass]="[
        inline() ? 'notion-page-icon-inline' : 'notion-page-icon-hero',
        type() === 'image' ? 'notion-page-icon-image' : 'notion-page-icon-span',
      ]"
    >
      @if (type() === 'image') {
        <an-lazy-image
          [fill]="false"
          [src]="src()"
          [alt]="alt()"
          [className]="[className(), 'notion-page-icon'].join(' ')"
        />
      } @else if (type() === 'defaultIcon') {
        <an-default-page-icon
          [className]="[className(), 'notion-page-icon'].join(' ')"
        />
      } @else if (type() === 'icon') {
        <span
          [ngClass]="[className(), 'notion-page-icon'].join(' ')"
          role="img"
          [attr.aria-label]="icon()"
          >{{ icon() }}</span
        >
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPageIconComponent {
  readonly block = input.required<Block>();
  readonly className = input<string>('');
  readonly inline = input<boolean>(true);
  readonly hideDefaultIcon = input<boolean>(false);
  readonly defaultIcon = input<string | undefined>(undefined);
  readonly type = signal<undefined | 'image' | 'defaultIcon' | 'icon'>(
    undefined,
  );
  readonly src = signal<string>('');
  readonly alt = signal<string>('');
  readonly icon = signal<string | undefined>(undefined);
  private notionService = inject(NotionContextService);

  constructor() {
    effect(() => {
      const recordMap = this.notionService.recordMap();
      const block = this.block();
      const icon = this.icon();
      const defaultIcon = this.defaultIcon();
      const hideDefaultIcon = this.hideDefaultIcon();
      const darkMode = this.notionService.darkMode();
      const mapImageUrlFn = this.notionService.mapImageUrl();
      if (isIconBlock(block) && recordMap && mapImageUrlFn) {
        this.icon.set(getBlockIcon(block, recordMap)?.trim() || defaultIcon);
        const title = getBlockTitle(block, recordMap);
        if (icon && isUrl(icon)) {
          const url = mapImageUrlFn(icon, block);
          this.type.set('image');
          this.src.set(url ?? '');
          this.alt.set(title || 'page icon');
        } else if (icon && icon?.startsWith('/icons/')) {
          const url =
            'https://www.notion.so' +
            icon +
            '?mode=' +
            (darkMode ? 'dark' : 'light');
          this.type.set('image');
          this.src.set(url);
          this.alt.set(title || 'page icon');
        } else if (!icon) {
          if (!hideDefaultIcon) {
            this.type.set('defaultIcon');
          }
        } else {
          this.type.set('icon');
        }
      }
    });
  }
}
