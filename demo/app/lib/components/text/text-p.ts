import { Component, computed, inject, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { AnPageTitleComponent } from '../page-title.component';
import { NotionContextService } from '../../context.service';
import { PageFormat, SubDecoration } from 'notion-types/build/core';
import { Block } from 'notion-types';

@Component({
  selector: 'an-text-p',
  template: ` <ng-container
    *ngComponentOutlet="
      ctx.components()?.PageLink ?? null;
      inputs: {
        className: 'notion-link',
        href: ctx.mapPageUrl()(params().blockId),
      }
    "
  >
    @if (params().linkedBlock) {
      <an-page-title [block]="params().linkedBlock!" />
    }
  </ng-container>`,
  standalone: true,
  imports: [NgComponentOutlet, AnPageTitleComponent],
})
export class AnTextPComponent {
  readonly ctx = inject(NotionContextService);
  readonly decorator = input.required<SubDecoration>();

  readonly params = computed<{ blockId: string; linkedBlock: Block | null }>(
    () => {
      const decorator = this.decorator() as PageFormat;
      const blockId = decorator[1];
      const linkedBlock = this.ctx.recordMap()?.block[blockId]?.value ?? null;

      return {
        blockId,
        linkedBlock,
      };
    },
  );
}
