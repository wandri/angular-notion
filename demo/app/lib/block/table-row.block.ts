import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block, TableBlock } from 'notion-types';
import { NotionContextService } from '../context.service';
import { AnTextComponent } from '../components/text/text';
import { NgClass } from '@angular/common';
import { Color } from 'notion-types/build/core';

@Component({
  selector: 'an-table-row-block',
  imports: [AnTextComponent, NgClass],
  template: `
    @if (params()) {
      @if (
        params()!.tableBlock &&
        params()!.tableBlock.format.table_block_column_order
      ) {
        -->
        <tr
          [ngClass]="[
            'notion-simple-table-row',
            params()!.backgroundColor && 'notion-' + params()!.backgroundColor,
            blockId(),
          ]"
        >
          @for (
            column of params()!.tableBlock.format.table_block_column_order;
            track column
          ) {
            <td
              [ngClass]="
                [
                  params()!.formatMap?.[column]?.color
                    ? 'notion-' + params()!.formatMap?.[column]?.color
                    : '',
                ].join(' ')
              "
              [style.width.px]="
                params()!.tableBlock.format.table_block_column_format?.[column]
                  ?.width || 120
              "
            >
              <div class="notion-simple-table-cell">
                <an-text
                  [value]="block().properties?.[column] || [['ㅤ']]"
                  [block]="block()"
                />
              </div>
            </td>
          }
        </tr>
      }
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnTableRowBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();

  readonly params = computed<null | {
    tableBlock: TableBlock;
    order: string[];
    formatMap?: {
      [column: string]: {
        width?: number;
        color?: Color;
      };
    };
    backgroundColor: string;
  }>(() => {
    const tableBlock = this.ctx.recordMap().block[this.block().parent_id]
      ?.value as TableBlock;
    const order = tableBlock.format?.table_block_column_order;
    const formatMap = tableBlock.format?.table_block_column_format;
    const backgroundColor = this.block().format?.block_color;

    if (!tableBlock || !order) {
      return null;
    } else {
      return {
        tableBlock,
        order,
        formatMap,
        backgroundColor,
      };
    }
  });
}
