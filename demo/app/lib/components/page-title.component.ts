import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { Block, Decoration } from 'notion-types';
import { NotionContextService } from '../context.service';
import { getBlockTitle } from 'notion-utils';
import { NgClass } from '@angular/common';
import { AnPageIconComponent } from './page-icon.component';
import { AnTextComponent } from './text/text';

@Component({
  selector: 'an-page-title',
  standalone: true,
  imports: [NgClass, AnPageIconComponent, forwardRef(() => AnTextComponent)],
  template: `
    @if (params()) {
      <span [ngClass]="['notion-page-title', className()]">
        <an-page-icon
          [block]="block()"
          [defaultIcon]="defaultIcon()"
          className="notion-page-title-icon"
        />
        <span class="notion-page-title-text">
          <an-text [value]="params() ?? []" [block]="block()" />
        </span>
      </span>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPageTitleComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly className = input<string>('');
  readonly defaultIcon = input<undefined | string>(undefined);

  params = computed<null | Decoration[]>(() => {
    const block = this.block();
    const recordMap = this.ctx.recordMap();
    if (!block || !recordMap) return null;

    if (
      block.type === 'collection_view_page' ||
      block.type === 'collection_view'
    ) {
      const title = getBlockTitle(block, recordMap);
      if (!title) {
        return null;
      }

      const titleDecoration: Decoration[] = [[title]];
      return titleDecoration;
    }

    if (!block.properties?.title) {
      return null;
    }

    return block.properties?.title;
  });
}
