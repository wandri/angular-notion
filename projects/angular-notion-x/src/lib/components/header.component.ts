import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Block } from 'notion-types';
import {
  getBlockParentPage,
  getPageTableOfContents,
  getTextContent,
  uuidToId,
} from 'notion-utils';
import { NotionContextService } from '../context.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AnTextComponent } from './text.component';
import { AnLinkIconComponent } from '../icons/link-icon';

@Component({
  selector: 'an-header',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass, AnTextComponent, AnLinkIconComponent],
  template: `
    @if (block().properties) {
      @if (block().format?.toggleable) {
        <details [ngClass]="['notion-toggle', blockId() ?? '']">
          <summary>
            <ng-container *ngTemplateOutlet="headerBlock"></ng-container>
          </summary>
          <div>
            <ng-content></ng-content>
          </div>
        </details>
      } @else {
        <ng-container *ngTemplateOutlet="headerBlock"></ng-container>
      }

      <ng-template #headerBlock>
        @if (type().isH1) {
          <h2 [ngClass]="classNameStr() ?? ''" [attr.data-id]="params().id">
            <ng-container *ngTemplateOutlet="innerHeader"></ng-container>
          </h2>
          )
        } @else if (type().isH2) {
          <h3 [ngClass]="classNameStr() ?? ''" [attr.data-id]="params().id">
            <ng-container *ngTemplateOutlet="innerHeader"></ng-container>
          </h3>
          )
        } @else {
          <h4 [ngClass]="classNameStr() ?? ''" [attr.data-id]="params().id">
            <ng-container *ngTemplateOutlet="innerHeader"></ng-container>
          </h4>
          )
        }
      </ng-template>

      <ng-template #innerHeader>
        <span>
          <div [id]="params().id" class="notion-header-anchor"></div>
          @if (!block().format?.toggleable) {
            <a
              class="notion-hash-link"
              [href]="'#' + params().id"
              [title]="params().title"
            >
              <an-link-icon />
            </a>
          }
          <span class="notion-h-title">
            <an-text [value]="block().properties.title" [block]="block()" />
          </span>
        </span>
      </ng-template>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnHeaderComponent {
  readonly block = input.required<Block>();
  readonly blockId = input<string | undefined>(undefined);
  readonly indentLevelClass = signal<string | undefined>(undefined);
  readonly params = computed(() => {
    const id = uuidToId(this.block().id);
    return {
      blockColor: this.block().format?.block_color,
      id: id,
      title:
        getTextContent(this.block().properties.title) || `Notion Header ${id}`,
    };
  });
  readonly type = computed(() => {
    const block = this.block();
    return {
      isH1: block.type === 'header',
      isH2: block.type === 'sub_header',
      isH3: block.type === 'sub_sub_header',
    };
  });
  readonly classNameStr = computed<string[]>(() => {
    return [
      this.type().isH1 ? 'notion-h notion-h1' : '',
      this.type().isH2 ? 'notion-h notion-h2' : '',
      this.type().isH3 ? 'notion-h notion-h3' : '',
      this.params().blockColor ? `notion-${this.params().blockColor}` : '',
      this.indentLevelClass() ?? '',
      this.blockId() ?? '',
    ];
  });
  private ctx = inject(NotionContextService);

  constructor() {
    effect(
      () => {
        const block = this.block();
        const recordMap = this.ctx.recordMap();
        let indentLevel = this.ctx.tocIndentLevelCache[block.id];
        if (indentLevel === undefined && recordMap) {
          const page = getBlockParentPage(block, recordMap);

          if (page) {
            const toc = getPageTableOfContents(page, recordMap);
            const tocItem = toc.find((tocItem) => tocItem.id === block.id);
            if (tocItem) {
              indentLevel = tocItem.indentLevel;
              this.ctx.tocIndentLevelCache[block.id] = indentLevel;
            }
          }
        }
        if (indentLevel !== undefined) {
          this.indentLevelClass.set(`notion-h-indent-${indentLevel}`);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
