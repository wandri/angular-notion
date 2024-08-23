import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block } from 'notion-types';
import { NotionContextService } from '../context.service';
import { AnPageLinkComponent } from './link/page-link.component';
import { AnPageIconComponent } from './page-icon.component';
import { getPageBreadcrumbs } from 'notion-utils';

@Component({
  selector: 'an-breadcrumbs',
  standalone: true,
  imports: [AnPageLinkComponent, AnPageIconComponent],
  template: ` <div class="breadcrumbs">
    @for (breadcrumb of breadcrumbs(); track breadcrumb; let index = $index) {
      <an-page-link
        [component]=""
        [className]="
          ['breadcrumb', breadcrumb.active ? 'active' : ''].join(' ')
        "
        [href]="ctx.mapPageUrl()(breadcrumb.pageId)"
      >
        @if (breadcrumb.icon) {
          <an-page-icon className="icon" [block]="breadcrumb.block" />
        }
        @if (breadcrumb.title) {
          <span class="title">{{ breadcrumb.title }}</span>
        }
      </an-page-link>
      @if (index < (breadcrumbs()?.length ?? 0) - 1) {
        <span class="spacer">/</span>
      }
    }
  </div>`,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnBreadcrumbComponent {
  ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly rootOnly = input<boolean>(false);

  readonly breadcrumbs = computed<any[] | null>(() => {
    const breadcrumbs = getPageBreadcrumbs(
      this.ctx.recordMap(),
      this.block().id,
    );
    const arrayElement = breadcrumbs && breadcrumbs[0];
    if (this.rootOnly() && arrayElement) {
      return [arrayElement].filter(Boolean);
    }
    return breadcrumbs;
  });
}
