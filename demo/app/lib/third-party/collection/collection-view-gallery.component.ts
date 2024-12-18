import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Collection, CollectionView } from 'notion-types';
import { NotionContextService } from '../../context.service';
import { getCollectionGroups } from './collection.utils';
import { AnCollectionGroupComponent } from './collection-group.component';
import { NgClass } from '@angular/common';
import { AnCollectionCardComponent } from './collection-card.component';

@Component({
  selector: 'an-collection-gallery',
  imports: [NgClass, AnCollectionCardComponent],
  template: `
    @if (params()) {
      <div class="notion-gallery">
        <div class="notion-gallery-view">
          <div
            [ngClass]="[
              'notion-gallery-grid',
              'notion-gallery-grid-size-' + params()!.gallery_cover_size,
            ]"
          >
            @for (blockId of blockIds(); track blockId) {
              @if (ctx.recordMap().block[blockId].value) {
                <an-collection-card
                  [collection]="collection()"
                  [block]="ctx.recordMap().block[blockId].value"
                  [cover]="params()!.gallery_cover"
                  [coverSize]="params()!.gallery_cover_size"
                  [coverAspect]="params()!.gallery_cover_aspect"
                  [properties]="collectionView()?.format?.gallery_properties"
                />
              }
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionGalleryComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly collectionView = input<CollectionView | undefined>();
  readonly blockIds = input.required<string[]>();

  readonly params = computed<{
    gallery_cover: string;
    gallery_cover_size: string;
    gallery_cover_aspect: string;
  }>(() => {
    const {
      gallery_cover = { type: 'none' },
      gallery_cover_size = 'medium',
      gallery_cover_aspect = 'cover',
    } = this.collectionView()?.format || {};

    return {
      gallery_cover,
      gallery_cover_size,
      gallery_cover_aspect,
    };
  });
}

const defaultBlockIds: string[] = [];

@Component({
  selector: 'an-collection-view-gallery',
  imports: [AnCollectionGroupComponent, AnCollectionGalleryComponent],
  template: `
    @if (params()) {
      @if (params()!.isGroupedCollection) {
        @for (group of params()!.collectionGroups; track group) {
          <an-collection-group
            [collection]="group.collection"
            [collectionGroup]="group.collectionGroup"
            [schema]="group.schema"
            [value]="group.value"
            [hidden]="group.hidden"
            [summaryProps]="group.summaryProps"
            [detailsProps]="group.detailsProps"
          >
            <an-collection-gallery
              [blockIds]="group.blockIds"
              [collectionView]="group.collectionView"
              [collection]="group.collection"
            />
          </an-collection-group>
        }
      } @else {
        <an-collection-gallery
          [blockIds]="params()!.blockIds ?? []"
          [collectionView]="collectionView()"
          [collection]="collection()"
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
export class AnCollectionViewGalleryComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly collectionView = input<CollectionView | undefined>(undefined);
  readonly collectionData = input<any | undefined>(undefined);

  readonly params = computed<{
    isGroupedCollection: boolean;
    collectionGroups?: any;
    blockIds?: string[];
  }>(() => {
    const collectionView = this.collectionView();
    const isGroupedCollection = collectionView?.format?.collection_group_by;

    if (isGroupedCollection) {
      return {
        isGroupedCollection: true,
        collectionGroups: getCollectionGroups(
          this.collection(),
          collectionView,
          this.collectionData(),
        ),
      };
    } else {
      const blockIds =
        (this.collectionData()['collection_group_results']?.blockIds ??
          this.collectionData()['results:relation:uncategorized']?.blockIds ??
          this.collectionData().blockIds) ||
        defaultBlockIds;
      return {
        isGroupedCollection: false,
        blockIds,
      };
    }
  });
}
