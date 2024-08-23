import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AnTextComponent } from '../components/text/text';

@Component({
  selector: 'an-text-block',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass, AnTextComponent],
  template: `
    @if (!block().properties && !block().content?.length) {
      <div [ngClass]="['notion-blank', blockId()]">&nbsp;</div>
    } @else {
      <div
        [ngClass]="
          [
            'notion-text',
            blockColor() ? 'notion-' + blockColor() : '',
            blockId(),
          ].join(' ')
        "
      >
        @if (block().properties?.title) {
          <an-text [value]="block().properties.title" [block]="block()" />
        }
        <div class="notion-text-children">
          <ng-content />
        </div>
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
export class AnTextBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();

  readonly blockColor = computed(() => this.block().format?.block_color);
}
