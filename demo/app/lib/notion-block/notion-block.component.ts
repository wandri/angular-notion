import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { BlockComponent } from '../block/block.component';
import { NotionContextService } from '../context.service';

@Component({
  selector: 'an-notion-block',
  standalone: true,
  imports: [BlockComponent],
  template: `
    @if (block() && block().value) {
      <an-block [level]="level()" [block]="block().value!">
        @for (child of block()!.value!.content; track child) {
          <an-notion-block [blockId]="child" [level]="level() + 1" />
        }
      </an-block>
    }
  `,
  styles: `
    :host {
      display: block;
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
      return {
        id: id,
        value: recordMap.block[id]?.value,
      };
    } else {
      return {
        id: undefined,
        value: undefined,
      };
    }
  });
}
