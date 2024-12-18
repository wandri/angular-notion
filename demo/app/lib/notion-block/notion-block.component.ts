import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { BlockComponent } from '../block.component';
import { NotionContextService } from '../context.service';

@Component({
  selector: 'an-notion-block',
  imports: [forwardRef(() => BlockComponent)],
  template: `
    @if (block()) {
      <an-block [level]="level()" [block]="block()!">
        @for (child of block()!.content; track child) {
          <an-notion-block [blockId]="child" [level]="level() + 1" />
        }
      </an-block>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotionBlockComponent {
  readonly blockId = input<string | undefined>(undefined);
  readonly level = input<number>(0);
  private contextService = inject(NotionContextService);
  readonly block = computed(() => {
    const recordMap = this.contextService.recordMap();
    if (recordMap) {
      const id = this.blockId() || Object.keys(recordMap.block)[0];
      return recordMap.block[id]?.value;
    } else {
      return undefined;
    }
  });
}
