import { Component, computed, inject, input } from '@angular/core';
import { NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { AnEoiComponent } from '../eoi';
import { NotionContextService } from '../../context.service';
import {
  DateFormat,
  ExternalObjectInstanceFormat,
  SubDecoration,
} from 'notion-types/build/core';
import { Block, ExternalObjectInstance } from 'notion-types';
import { formatDate } from '../../utils';
import { AnTextPComponent } from './text-p';
import { AnTextExternalLinkComponent } from './text-external-link';
import { AnTextUComponent } from './text-u';
import { AnTextAComponent } from './text-a';

@Component({
  selector: 'an-text-classic',
  template: `
    @if (decorator()[0] === 'p') {
      <an-text-p [decorator]="decorator()"></an-text-p>
    } @else if (decorator()[0] === '‣') {
      <an-text-external-link
        [linkProps]="linkProps()"
        [block]="block()"
        [decorator]="decorator()"
      ></an-text-external-link>
    } @else if (decorator()[0] === 'h') {
      <span [ngClass]="['notion-' + decorator()[1]]"><ng-content /></span>
    } @else if (decorator()[0] === 'c') {
      <code class="notion-inline-code">
        <ng-container *ngTemplateOutlet="insideComponent" />
      </code>
    } @else if (decorator()[0] === 'b') {
      <b>
        <ng-container *ngTemplateOutlet="insideComponent" />
      </b>
    } @else if (decorator()[0] === 'i') {
      <em>
        <ng-container *ngTemplateOutlet="insideComponent" />
      </em>
    } @else if (decorator()[0] === 's') {
      <s>
        <ng-container *ngTemplateOutlet="insideComponent" />
      </s>
    } @else if (decorator()[0] === '_') {
      <span class="notion-inline-underscore">
        <ng-container *ngTemplateOutlet="insideComponent" />
      </span>
    } @else if (decorator()[0] === 'e') {
      <ng-container
        *ngComponentOutlet="
          ctx.components()?.Equation ?? null;
          inputs: { inline: true, math: decorator()[1] }
        "
      />
    } @else if (decorator()[0] === 'm') {
      <ng-content />
    } @else if (decorator()[0] === 'a') {
      <an-text-a
        [linkProtocol]="linkProtocol()"
        [decorator]="decorator()"
        [linkProps]="linkProps()"
      >
        <ng-container *ngTemplateOutlet="insideComponent" />
      </an-text-a>
    } @else if (decorator()[0] === 'd') {
      @if (dateFormat()) {
        {{ dateFormat() }}
      } @else {
        <ng-container *ngTemplateOutlet="insideComponent" />
      }
    } @else if (decorator()[0] === 'u') {
      <an-text-u [block]="block()" [decorator]="decorator()" />
    } @else if (decorator()[0] === 'eoi' && eoiBlock()) {
      <an-eoi [block]="eoiBlock()!" [inline]="true"></an-eoi>
    } @else {
      <ng-container *ngTemplateOutlet="insideComponent" />
    }

    <ng-template #insideComponent let-item="item" let-index="index">
      @if (decorator()[index() + 1]) {
        <an-text-classic
          [linkProps]="linkProps()"
          [linkProtocol]="linkProtocol()"
          [index]="index() + 1"
          [block]="block()"
          [decorations]="decorations()"
        >
          <ng-content />
        </an-text-classic>
      } @else {
        <ng-content />
      }
    </ng-template>
  `,
  standalone: true,
  imports: [
    NgClass,
    NgComponentOutlet,
    NgTemplateOutlet,
    AnTextPComponent,
    AnTextExternalLinkComponent,
    AnTextUComponent,
    AnEoiComponent,
    AnTextAComponent,
  ],
})
export class AnTextClassicComponent {
  readonly ctx = inject(NotionContextService);
  readonly decorations = input.required<SubDecoration[]>();
  readonly block = input.required<Block>();
  readonly linkProps = input.required<any | undefined>();
  readonly index = input<number>(0);
  readonly linkProtocol = input.required<string | undefined>();
  readonly decorator = computed(() => {
    return this.decorations()[this.index()];
  });

  readonly eoiBlock = computed<null | Block>(() => {
    const recordMap = this.ctx.recordMap();
    const decorator = this.decorator();
    if (!recordMap) return null;
    if (decorator[0] === 'eoi') {
      const blockId = (<ExternalObjectInstanceFormat>decorator)[1];
      return recordMap.block[blockId]?.value as ExternalObjectInstance;
    } else {
      return null;
    }
  });

  dateFormat = computed<string | null>(() => {
    const decorator = this.decorator();
    if (decorator[0] !== 'd') return null;
    const v = (<DateFormat>decorator)[1];
    const type = v?.type;

    if (type === 'date') {
      // Example: Jul 31, 2010
      const startDate = v.start_date;

      return formatDate(startDate);
    } else if (type === 'datetime') {
      // Example: Jul 31, 2010 20:00
      const startDate = v.start_date;
      const startTime = v.start_time;

      return `${formatDate(startDate)} ${startTime}`;
    } else if (type === 'daterange') {
      // Example: Jul 31, 2010 → Jul 31, 2020
      const startDate = v.start_date;
      const endDate = v.end_date;

      return endDate
        ? `${formatDate(startDate)} → ${formatDate(endDate)}`
        : null;
    } else {
      return null;
    }
  });
}
