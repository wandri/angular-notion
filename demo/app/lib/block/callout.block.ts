import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { AnPageIconComponent } from '../components/page-icon.component';
import { AnTextComponent } from '../components/text/text';

@Component({
  selector: 'an-callout-block',
  imports: [AnPageIconComponent, AnTextComponent, NgComponentOutlet, NgClass],
  template: `
    @if (ctx.components().Callout) {
      <ng-container
        *ngComponentOutlet="
          ctx.components()?.Callout ?? null;
          inputs: { block: block(), className: blockId() }
        "
      />
    } @else {
      <div
        [ngClass]="[
          'notion-callout',
          block().format?.block_color
            ? 'notion-' + block().format?.block_color
            : '',
          blockId(),
        ]"
      >
        <an-page-icon [block]="block()" />
        <div class="notion-callout-text">
          <an-text [value]="block().properties?.title" [block]="block()" />
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
export class AnCalloutBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();
}
