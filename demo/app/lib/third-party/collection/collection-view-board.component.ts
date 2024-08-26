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
import { NgClass, NgStyle } from '@angular/common';
import { AnPropertyComponent } from './property/property.component';
import { AnSvgEmptyComponent } from '../../icons/empty-icon';
import { AnCollectionCardComponent } from './collection-card.component';

@Component({
  selector: 'an-collection-board',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    AnPropertyComponent,
    AnSvgEmptyComponent,
    AnCollectionCardComponent,
  ],
  template: `
    @if (params()) {
      <div class="notion-board">
        <div
          [ngClass]="[
            'notion-board-view',
            'notion-board-view-size-' + params().board_cover_size,
          ]"
          [ngStyle]="boardStyle()"
        >
          <div class="notion-board-header">
            <div class="notion-board-header-inner">
              @for (group of params().groups1; track group) {
                <div class="notion-board-th">
                  <div class="notion-board-th-body">
                    @if (group.group.value?.value) {
                      <an-property
                        [schema]="group.schema"
                        [data]="[
                          [
                            group.group.value?.value[params().boardGroupBy] ||
                              group.group.value?.value,
                          ],
                        ]"
                        [collection]="collection()"
                      />
                    } @else {
                      <span
                        ><an-svg-empty-icon className="notion-board-th-empty" />
                        NoSelect</span
                      >
                    }
                    <span class="notion-board-th-count">{{
                      group.group.total
                    }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="notion-board-header-placeholder"></div>

          <div class="notion-board-body">
            @for (group of params().groups2; track group) {
              <div class="notion-board-group">
                @for (blockId of group.group.blockIds ?? []; track blockId) {
                  @if (ctx.recordMap().block[blockId].value) {
                    <an-collection-card
                      className="notion-board-group-card"
                      [collection]="collection()"
                      [block]="ctx.recordMap().block[blockId].value"
                      [cover]="params().board_cover"
                      [coverSize]="params().board_cover_size"
                      [coverAspect]="params().board_cover_aspect"
                      [properties]="collectionView()?.format?.board_properties"
                    />
                  }
                }
              </div>
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
export class AnCollectionBoardComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly collectionView = input.required<CollectionView | undefined>();
  readonly collectionData = input.required<any | undefined>();
  readonly padding = input.required<any | undefined>();

  readonly boardStyle = computed(() => {
    return {
      paddingLeft: this.padding(),
    };
  });

  readonly params = computed<{
    board_cover: any;
    board_cover_size: any;
    board_cover_aspect: any;
    groups1: any[];
    groups2: any[];
    boardGroupBy: any;
  }>(() => {
    const {
      board_cover = { type: 'none' },
      board_cover_size = 'medium',
      board_cover_aspect = 'cover',
    } = this.collectionView()?.format || {};

    const boardGroups =
      this.collectionView()?.format?.board_columns ||
      this.collectionView()?.format?.board_groups2 ||
      [];

    const collectionData = this.collectionData();
    const groups1 = boardGroups
      .map((p: any, index: number) => {
        if (!(collectionData as any).board_columns?.results) {
          // no groupResults in the data when collection is in a toggle
          return null;
        }
        const group = (collectionData as any).board_columns.results![index];
        const schema = this.collection().schema[p.property];

        if (!group || !schema || p.hidden) {
          return null;
        }

        return {
          group,
          schema,
        };
      })
      .filter((p: any) => !!p);

    const groups2 = boardGroups.map((p: any) => {
      const boardResults = (collectionData as any).board_columns?.results;
      if (!boardResults) return null;
      if (!p?.value?.type) return null;

      const schema = this.collection().schema[p.property];
      const group = (collectionData as any)[
        `results:${p?.value?.type}:${p?.value?.value || 'uncategorized'}`
      ];

      if (!group || !schema || p.hidden) {
        return null;
      }

      return {
        group,
        schema,
      };
    });

    const boardGroupBy =
      this.collectionView()?.format?.board_columns_by?.groupBy;

    return {
      board_cover,
      board_cover_size,
      board_cover_aspect,
      groups1: groups1,
      groups2: groups2,
      boardGroupBy,
    };
  });
}

const defaultBlockIds: string[] = [];

@Component({
  selector: 'an-collection-view-board',
  standalone: true,
  imports: [AnCollectionGroupComponent, AnCollectionBoardComponent],
  template: `
    @if (params().collectionGroups) {
      @for (group of params().collectionGroups ?? []; track group) {
        <an-collection-group
          [collection]="group.collection"
          [collectionGroup]="group.collectionGroup"
          [schema]="group.schema"
          [value]="group.value"
          [hidden]="group.hidden"
          [summaryProps]="{
            style: {
              paddingLeft: padding(),
            },
          }"
          [detailsProps]="group.detailsProps"
        >
          <an-collection-board
            [padding]="padding()"
            [collection]="group.collection"
            [collectionData]="group.collectionData"
            [collectionView]="group.collectionView"
          />
        </an-collection-group>
      }
    } @else {
      <an-collection-board
        [padding]="padding()"
        [collection]="collection()"
        [collectionData]="collectionData()"
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
export class AnCollectionViewBoardComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly collectionView = input.required<CollectionView | undefined>();
  readonly collectionData = input.required<any | undefined>();
  readonly padding = input.required<any | undefined>();

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
        this.padding(),
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
