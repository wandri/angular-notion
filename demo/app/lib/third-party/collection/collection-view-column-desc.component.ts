import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CollectionView } from 'notion-types';
import { NgClass } from '@angular/common';
import { AnPropertyIconComponent } from '../../icons/collection-view-icon';

@Component({
  selector: 'an-collection-view-column-desc',
  imports: [NgClass, AnPropertyIconComponent],
  template: `
    @if (params()) {
      <div [ngClass]="['notion-collection-view-type', className()]">
        <an-collection-view-icon
          className="notion-collection-view-type-icon"
          [type]="params()!.type"
        />

        <span class="notion-collection-view-type-title">{{
          params()!.name
        }}</span>

        <ng-content />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionViewColumnDescComponent {
  readonly collectionView = input.required<CollectionView>();
  readonly className = input<string>('');

  readonly params = computed<{ type: string; name: string }>(() => {
    const collectionView = this.collectionView();
    const { type } = collectionView;
    const name =
      collectionView.name || `${type[0].toUpperCase()}${type.slice(1)} view`;
    return {
      type,
      name,
    };
  });
}
