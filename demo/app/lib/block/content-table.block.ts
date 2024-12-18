import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import {
  getBlockParentPage,
  getPageTableOfContents,
  TableOfContentsEntry,
  uuidToId,
} from 'notion-utils';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-content-table-block',
  imports: [NgClass],
  template: `
    @if (params() && params()?.page) {
      <div
        [ngClass]="[
          'notion-table-of-contents',
          params()!.blockColor ? 'notion-' + params()!.blockColor : '',
          blockId(),
        ]"
      >
        @for (tocItem of params()!.toc; track tocItem.id) {
          <a
            [href]="'#' + uuidToId(tocItem.id)"
            class="notion-table-of-contents-item"
          >
            <span
              class="notion-table-of-contents-item-body"
              [style.display]="'inline-block'"
              [style.marginLeft.px]="tocItem.indentLevel * 24"
            >
              {{ tocItem.text }}
            </span>
          </a>
        }
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
export class AnContentTableBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();
  readonly params = computed<null | {
    page: Block | null;
    toc: Array<TableOfContentsEntry>;
    blockColor: string;
  }>(() => {
    const page = getBlockParentPage(this.block(), this.ctx.recordMap());
    if (!page) return null;

    const toc = getPageTableOfContents(page, this.ctx.recordMap());
    const blockColor = this.block().format?.block_color;

    return {
      page,
      toc,
      blockColor,
    };
  });
  protected readonly uuidToId = uuidToId;
}
