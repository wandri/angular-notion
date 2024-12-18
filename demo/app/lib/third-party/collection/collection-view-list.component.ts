import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block, Collection, CollectionView } from 'notion-types';
import { NotionContextService } from '../../context.service';
import { getCollectionGroups } from './collection.utils';
import { AnCollectionGroupComponent } from './collection-group.component';
import { AnPageLinkComponent } from '../../components/link/page-link.component';
import { AnPropertyComponent } from './property/property.component';

@Component({
  selector: 'an-collection-list',
  imports: [AnPageLinkComponent, AnPropertyComponent],
  template: `
    <div class="notion-list-collection">
      <div class="notion-list-view">
        <div class="notion-list-body">
          @for (blockId of blockIds() ?? []; track blockId) {
            @if (ctx.recordMap().block[blockId].value) {
              <an-page-link
                [href]="
                  ctx.mapPageUrl()(ctx.recordMap().block[blockId].value.id)
                "
                className="notion-list-item notion-page-link"
              >
                <div class="notion-list-item-title">
                  <an-property
                    [schema]="collection().schema['title']"
                    [data]="
                      ctx.recordMap().block[blockId].value.properties?.title
                    "
                    [block]="ctx.recordMap().block[blockId].value"
                    [collection]="collection()"
                  />
                </div>
                <div class="notion-list-item-body">
                  @for (
                    p of getView(ctx.recordMap().block[blockId].value);
                    track p
                  ) {
                    <div class="notion-list-item-property">
                      <an-property
                        [schema]="p.schema"
                        [data]="p.data"
                        [block]="ctx.recordMap().block[blockId].value"
                        [collection]="collection()"
                      />
                    </div>
                  }
                </div>
              </an-page-link>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionListComponent {
  readonly ctx = inject(NotionContextService);
  readonly blockIds = input.required<string[] | undefined>();
  readonly collection = input.required<Collection>();
  readonly collectionView = input.required<CollectionView | undefined>();

  getView(block: Block): any[] {
    const collectionView = this.collectionView();
    if (!collectionView) return [];
    return collectionView?.format?.list_properties
      ?.filter((p: { visible: boolean; property: any }) => p.visible)
      .map((p: { visible: boolean; property: any }) => {
        const schema = this.collection().schema[p.property];
        const data = block && block.properties?.[p.property];
        return { schema, data };
      });
  }
}

const defaultBlockIds: string[] = [];

@Component({
  selector: 'an-collection-view-list',
  imports: [AnCollectionGroupComponent, AnCollectionListComponent],
  template: `
    @if (params().collectionGroups) {
      @for (group of params().collectionGroups ?? []; track group) {
        <an-collection-group
          [collection]="group.collection"
          [collectionGroup]="group.collectionGroup"
          [schema]="group.schema"
          [value]="group.value"
          [hidden]="group.hidden"
          [summaryProps]="group.summaryProps"
          [detailsProps]="group.detailsProps"
        >
          <an-collection-list
            [blockIds]="group.blockIds"
            [collection]="group.collection"
            [collectionView]="group.collectionView"
          />
        </an-collection-group>
      }
    } @else {
      <an-collection-list
        [blockIds]="params().blockIds"
        [collection]="collection()"
        [collectionView]="collectionView()"
      />
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionViewListComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly collectionView = input.required<CollectionView | undefined>();
  readonly collectionData = input.required<any | undefined>();

  readonly params = computed<{
    blockIds?: string[];
    collectionGroups?: any[];
  }>(() => {
    const collectionView = this.collectionView();
    const isGroupedCollection = collectionView?.format?.collection_group_by;

    if (isGroupedCollection) {
      const collectionGroups = getCollectionGroups(
        this.collection(),
        collectionView,
        this.collectionData(),
      );

      return {
        collectionGroups,
      };
    } else {
      const blockIds =
        (this.collectionData()['collection_group_results']?.blockIds ??
          this.collectionData().blockIds) ||
        defaultBlockIds;

      return {
        blockIds,
      };
    }
  });
}
