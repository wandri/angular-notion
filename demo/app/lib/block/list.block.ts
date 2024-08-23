import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block, Decoration } from 'notion-types';
import { NotionContextService } from '../context.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { getListNumber } from '../utils';
import { AnTextComponent } from '../components/text/text';

@Component({
  selector: 'an-wrap-list',
  standalone: true,
  imports: [NgTemplateOutlet, AnTextComponent, NgClass],
  template: `
    @if (block().type === 'bulleted_list') {
      <ul [ngClass]="['notion-list', 'notion-list-disc', blockId() ?? '']">
        <ng-container *ngTemplateOutlet="innerContent" />
      </ul>
    } @else {
      <ol
        [ngClass]="['notion-list', 'notion-list-numbered', blockId() ?? '']"
        [start]="start()"
      >
        <ng-container *ngTemplateOutlet="innerContent" />
      </ol>
    }
    <ng-template #innerContent>
      <ng-content />
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnWrapListComponent {
  readonly block = input.required<Block>();
  readonly blockId = input<string | undefined>(undefined);
  readonly start = input<number | undefined>(undefined);
}

@Component({
  selector: 'an-list-block',
  standalone: true,
  imports: [NgTemplateOutlet, AnTextComponent, NgClass, AnWrapListComponent],
  template: `
    @if (params()) {
      @if (params()!.isTopLevel) {
        <an-wrap-list
          [blockId]="blockId()"
          [block]="block()"
          [start]="params()!.start"
        >
          <ng-container *ngTemplateOutlet="output" />
        </an-wrap-list>
      } @else {
        <ng-container *ngTemplateOutlet="output" />
      }

      <ng-template #output>
        @if (params()!.title) {
          <li>
            <an-text [value]="block().properties.title" [block]="block()" />
          </li>
        }
        @if (params()!.children) {
          <an-wrap-list [blockId]="blockId()" [block]="block()">
            <ng-content />
          </an-wrap-list>
        }
      </ng-template>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnListBlockComponent {
  readonly block = input.required<Block>();
  readonly blockId = input<string | undefined>(undefined);
  private ctx = inject(NotionContextService);
  readonly params = computed<null | {
    title?: Decoration[];
    children: boolean;
    isTopLevel: boolean;
    start?: number;
  }>(() => {
    const block = this.block();
    const recordMap = this.ctx.recordMap();
    if (!block) return null;
    let output: { title?: Decoration[]; children: boolean } = {
      children: false,
    };
    if (block.content) {
      if (block.properties) {
        output.title = block.properties.title;
      }
      output.children = true;
    } else {
      output.title = block.properties.title;
    }

    const isTopLevel =
      block.type !== recordMap.block[block.parent_id]?.value?.type;
    const start = getListNumber(block.id, recordMap.block);

    return {
      ...output,
      isTopLevel: isTopLevel,
      start: start,
    };
  });
}
