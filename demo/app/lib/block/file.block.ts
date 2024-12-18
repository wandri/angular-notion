import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block } from 'notion-types';
import { NotionContextService } from '../context.service';
import { NgClass } from '@angular/common';
import { AnLinkComponent } from '../components/link/link.component';
import { AnTextComponent } from '../components/text/text';
import { AnSvgFileComponent } from '../icons/file-icon';

@Component({
  selector: 'an-file-block',
  imports: [NgClass, AnLinkComponent, AnTextComponent, AnSvgFileComponent],
  template: `
    <div [ngClass]="['notion-file', className()].join(' ')">
      <an-link
        className="notion-file-link"
        [href]="source()"
        target="_blank"
        rel="noopener noreferrer"
      >
        <an-file-icon className="notion-file-icon" />

        <div class="notion-file-info">
          <div class="notion-file-title">
            <an-text
              [value]="block().properties?.title || [['File']]"
              [block]="block()"
            />
          </div>
          @if (block().properties?.size) {
            <div class="notion-file-size">
              <an-text [value]="block().properties.size" [block]="block()" />
            </div>
          }
        </div>
      </an-link>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnFileBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly className = input<string>('');

  readonly source = computed(() => {
    return (
      this.ctx.recordMap().signed_urls[this.block().id] ||
      this.block().properties?.source?.[0]?.[0]
    );
  });
}
