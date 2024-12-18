import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { AnPageLinkComponent } from '../components/link/page-link.component';
import { AnPageTitleComponent } from '../components/page-title.component';

@Component({
  selector: 'an-alias-block',
  imports: [AnPageLinkComponent, AnPageTitleComponent],
  template: `
    @if (titleBlock()) {
      <an-page-link
        [component]="ctx.components().PageLink ?? null"
        [className]="
          ['notion-page-link', block().format.alias_pointer?.id].join(' ')
        "
        [href]="ctx.mapPageUrl()(block().format.alias_pointer?.id)"
      >
        <an-page-title [block]="titleBlock()" />
      </an-page-link>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnAliasBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();

  titleBlock = computed(() => {
    return this.ctx.recordMap()!.block[this.block().format.alias_pointer.id]
      ?.value;
  });
}
