import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Collection, CollectionView } from 'notion-types';
import { getCollectionGroups } from './collection.utils';
import { AnCollectionTableComponent } from './collection-table.component';
import { AnCollectionGroupComponent } from './collection-group.component';

const defaultBlockIds: string[] = [];

@Component({
  selector: 'an-collection-view-table',
  imports: [AnCollectionTableComponent, AnCollectionGroupComponent],
  template: `
    @if (params()) {
      @if (params()!.collectionGroups) {
        @for (group of params()!.collectionGroups ?? []; track group) {
          <an-collection-group
            [collection]="collection()"
            [summaryProps]="{
              style: {
                paddingLeft: padding(),
                paddingRight: padding(),
              },
            }"
          >
            <an-collection-table
              [padding]="padding()"
              [width]="width()"
              [collectionView]="collectionView()"
              [collection]="collection()"
            />
          </an-collection-group>
        }
      } @else {
        <an-collection-table
          [blockIds]="params()!.blockIds ?? []"
          [collection]="collection()"
          [collectionView]="collectionView()"
          [padding]="padding()"
          [width]="width()"
        />
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
export class AnCollectionViewTableComponent {
  readonly collection = input.required<Collection>();
  readonly collectionView = input<CollectionView | undefined>(undefined);
  readonly collectionData = input<any>(undefined);
  readonly padding = input<number>(0);
  readonly width = input<number>(100);

  readonly params = computed<null | {
    blockIds: string[] | null;
    collectionGroups: any[] | null;
  }>(() => {
    const collectionView = this.collectionView();
    const isGroupedCollection = collectionView?.format?.collection_group_by;
    const collection = this.collection();
    const collectionData = this.collectionData();
    const padding = this.padding();
    const width = this.width();

    if (isGroupedCollection) {
      if (!collection) return null;

      const collectionGroups = getCollectionGroups(
        collection,
        collectionView,
        collectionData,
        padding,
        width,
      );
      return {
        blockIds: null,
        collectionGroups,
      };
    } else {
      const blockIds =
        (collectionData['collection_group_results']?.blockIds ??
          collectionData.blockIds) ||
        defaultBlockIds;

      return {
        blockIds,
        collectionGroups: null,
      };
    }
  });
}
