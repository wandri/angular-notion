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
import { getBlockTitle } from 'notion-utils';
import { NgClass } from '@angular/common';
import { AnPageIconComponent } from './page-icon.component';
import { AnTextComponent } from './text.component';

@Component({
  selector: 'an-default-page-link',
  standalone: true,
  imports: [],
  template: ` <a
    [className]="className()"
    [href]="href()"
    [type]="type()"
    [target]="target()"
    [rel]="rel()"
    [hreflang]="hreflang()"
    [download]="download()"
  >
    <ng-content />
  </a>`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnDefaultPageLinkComponent {
  readonly className = input<string>('');
  readonly href = input.required<string | undefined>();
  readonly type = input<string | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);
  readonly rel = input<string | undefined>(undefined);
  readonly media = input<string | undefined>(undefined);
  readonly hreflang = input<string | undefined>(undefined);
  readonly download = input<string | undefined>(undefined);
}

@Component({
  selector: 'an-default-link',
  standalone: true,
  imports: [],
  template: ` <a
    [className]="className()"
    [href]="href()"
    [type]="type()"
    target="_blank"
    rel="noopener noreferrer"
    [hreflang]="hreflang()"
    [download]="download()"
  >
    <ng-content />
  </a>`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnDefaultLinkComponent {
  readonly className = input<string>('');
  readonly href = input.required<string | undefined>();
  readonly type = input<string | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);
  readonly rel = input<string | undefined>(undefined);
  readonly media = input<string | undefined>(undefined);
  readonly hreflang = input<string | undefined>(undefined);
  readonly download = input<string | undefined>(undefined);
}
