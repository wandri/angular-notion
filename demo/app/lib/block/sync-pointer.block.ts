import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { Block } from 'notion-types';
import { NotionContextService } from '../context.service';
import { NotionBlockComponent } from '../notion-block/notion-block.component';

@Component({
  selector: 'an-sync-pointer-block',
  standalone: true,
  imports: [forwardRef(() => NotionBlockComponent)],
  template: `
    @if (params()) {
      <an-notion-block [blockId]="params()!" [level]="level()" />
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnSyncPointerBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly level = input.required<number>();

  readonly params = computed<null | string>(() => {
    if (!this.block()) {
      return null;
    }

    const syncPointerBlock = this.block();
    const referencePointerId =
      syncPointerBlock?.format?.transclusion_reference_pointer?.id;

    if (!referencePointerId) {
      return null;
    }
    return referencePointerId;
  });
}
