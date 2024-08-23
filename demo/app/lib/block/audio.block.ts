import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { NgClass } from '@angular/common';

@Component({
  selector: 'an-audio-block',
  standalone: true,
  imports: [NgClass],
  template: `
    <div [ngClass]="['notion-audio', className()].join(' ')">
      <audio controls preload="none" [src]="source()"></audio>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnAudioBlockComponent {
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
