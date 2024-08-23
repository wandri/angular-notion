import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CollectionViewPageBlock, PageBlock } from 'notion-types';
import { AnBreadcrumbComponent } from './breadcrumb.component';
import { AnSearchComponent } from './search.component';

@Component({
  selector: 'an-header',
  standalone: true,
  imports: [AnBreadcrumbComponent, AnSearchComponent],
  template: ` <header class="notion-header">
    <div class="notion-nav-header">
      <an-breadcrumbs [block]="block()" />
      <an-search [block]="block()" />
    </div>
  </header>`,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnHeaderComponent {
  readonly block = input.required<CollectionViewPageBlock | PageBlock>();
}
