import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { Block, Decoration } from 'notion-types';
import { NotionContextService } from '../context.service';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { SubDecoration } from 'notion-types/build/core';
import { AnTextClassicComponent } from './text/text-classic';

@Component({
  selector: 'an-text',
  standalone: true,
  imports: [
    NgStyle,
    NgTemplateOutlet,
    forwardRef(() => AnTextClassicComponent),
  ],
  template: `
    @for (item of value(); track index; let index = $index) {
      @if (!item[1]) {
        @if (item[0] === ',') {
          <span [ngStyle]="{ padding: '0.5em' }"></span>
        } @else {
          {{ item[0] }}
        }
      } @else {
        <an-text-classic
          [linkProps]="linkProps()"
          [index]="0"
          [linkProtocol]="linkProtocol()"
          [block]="block()"
          [decorations]="decorations() ? (decorations()![index] ?? []) : []"
        >
          {{ item[0] }}
        </an-text-classic>
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnTextComponent {
  readonly value = input.required<Decoration[]>();
  readonly block = input.required<Block>();
  readonly linkProps = input<any>(undefined);
  readonly linkProtocol = input<string | undefined>(undefined);
  readonly inline = input<boolean>(false);
  private ctx = inject(NotionContextService);
  readonly decorations = computed<(null | SubDecoration[])[]>(() => {
    const recordMap = this.ctx.recordMap();
    if (!recordMap) return new Array(this.value.length).fill(null);
    const value = this.value();
    return value.map((item) => {
      if (!item[1]) {
        return null;
      }
      const decorations = item[1] as SubDecoration[];
      return [...decorations].reverse();
    });
  });
}
