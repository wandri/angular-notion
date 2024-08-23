import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'an-column-block',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle, NgClass],
  template: `
    <div [ngClass]="['notion-column', blockId()]" [ngStyle]="style()">
      <ng-content />
    </div>

    <div class="notion-spacer"></div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnColumnBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();

  readonly style = computed(() => {
    const spacerWidth = `min(32px, 4vw)`;
    const ratio = this.block().format?.column_ratio || 0.5;
    const parent = this.ctx.recordMap().block[this.block().parent_id]?.value;
    const columns =
      parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio));

    const width = `calc((100% - (${columns - 1} * ${spacerWidth})) * ${ratio})`;
    return { width };
  });
}
