import { Component, computed, forwardRef, inject, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { AnGracefulImageComponent } from '../graceful-image.component';
import { AnPageTitleComponent } from '../page-title.component';
import { NotionContextService } from '../../context.service';
import { LinkFormat, SubDecoration } from 'notion-types/build/core';
import { parsePageId } from 'notion-utils';
import { getHashFragmentValue } from '../../utils';

@Component({
  selector: 'an-text-a',
  template: `
    @if (params().isRootDomain) {
      <ng-container
        *ngComponentOutlet="
          ctx.components()?.PageLink ?? null;
          inputs: {
            className: 'notion-link',
            href: params().href,
            linkProps: linkProps(),
          }
        "
      >
        <ng-content /> </ng-container
      >,
    } @else {
      <ng-container
        *ngComponentOutlet="
          ctx.components()?.Link ?? null;
          inputs: {
            className: 'notion-link',
            href: params().href,
            linkProps: linkProps(),
          }
        "
      >
        <ng-content /> </ng-container
      >,
    }
  `,
  standalone: true,
  imports: [
    NgComponentOutlet,
    AnGracefulImageComponent,
    forwardRef(() => AnPageTitleComponent),
  ],
})
export class AnTextAComponent {
  readonly ctx = inject(NotionContextService);
  readonly linkProtocol = input.required<string | undefined>();
  readonly decorator = input.required<SubDecoration>();
  readonly linkProps = input.required<any>();
  readonly params = computed(() => {
    const decorator = this.decorator() as LinkFormat;
    const rootDomain = this.ctx.rootDomain() as string;
    const v = decorator[1];
    const pathname = v.substr(1);
    const id = parsePageId(pathname, { uuid: true });
    if ((v[0] === '/' || v.includes(rootDomain)) && id) {
      const href = v.includes(rootDomain)
        ? v
        : `${this.ctx.mapPageUrl()(id)}${getHashFragmentValue(v)}`;

      return {
        isRootDomain: true,
        href,
      };
    } else {
      return {
        isRootDomain: false,
        href: this.linkProtocol()
          ? `${this.linkProtocol()}:${decorator[1]}`
          : decorator[1],
      };
    }
  });
}
