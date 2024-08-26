import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../../context.service';
import { Block } from 'notion-types';
import { AnCollectionViewBlockComponent } from './collection-view-block.component';
import { AnCollectionRowComponent } from './collection-row.component';

@Component({
  selector: 'an-collection',
  standalone: true,
  imports: [AnCollectionViewBlockComponent, AnCollectionRowComponent],
  template: `
    @if (isReady()) {
      @if (this.block().type === 'page') {
        <div class="notion-collection-page-properties">
          <an-collection-row
            [block]="block()"
            [pageHeader]="true"
            [className]="className()"
          />
        </div>
      } @else {
        <an-collection-view-block [block]="block()" [className]="className()" />
      }
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly className = input<string>('');

  readonly isReady = computed<boolean>(() => {
    if (this.block().type === 'page') {
      if (this.block().parent_table !== 'collection') {
        return false;
      }
    }
    return true;
  });
}
