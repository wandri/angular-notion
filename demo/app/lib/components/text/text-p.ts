import { Component, computed, inject, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { AnPageTitleComponent } from '../page-title.component';
import { NotionContextService } from '../../context.service';
import { PageFormat, SubDecoration } from 'notion-types/build/core';
import { Block } from 'notion-types';
import { AnPageLinkComponent } from '../link/page-link.component';

@Component({
  selector: 'an-text-p',
  template: `
    <an-page-link
      [component]="ctx.components().PageLink"
      [href]="ctx.mapPageUrl()(params().blockId)"
      [className]="'notion-link'"
    >
      @if (params().linkedBlock) {
        <an-page-title [block]="params().linkedBlock!" />
      }
    </an-page-link>
  `,
  standalone: true,
  styles: `
    :host {
      display: contents;
    }
  `,
  imports: [NgComponentOutlet, AnPageTitleComponent, AnPageLinkComponent],
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
