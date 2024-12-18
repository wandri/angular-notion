import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { NotionContextService } from '../../context.service';
import { NgClass } from '@angular/common';
import { AnCollectionViewColumnDescComponent } from './collection-view-column-desc.component';

@Component({
  selector: 'an-collection-view-tab',
  imports: [NgClass, AnCollectionViewColumnDescComponent],
  template: `
    <div class="notion-collection-view-tabs-row">
      @for (viewId of viewIds(); track viewId) {
        <button
          (click)="onChangeView.emit(viewId)"
          [ngClass]="[
            'notion-collection-view-tabs-content-item',
            collectionViewId() === viewId
              ? 'notion-collection-view-tabs-content-item-active'
              : '',
          ]"
        >
          <an-collection-view-column-desc
            [collectionView]="ctx.recordMap().collection_view[viewId].value"
          />
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionViewTabComponent {
  readonly ctx = inject(NotionContextService);

  readonly collectionViewId = input.required<string>();
  readonly viewIds = input<string[]>([]);
  readonly onChangeView = output<string>();
}
