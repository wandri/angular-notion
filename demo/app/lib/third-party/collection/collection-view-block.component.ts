import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NotionContextService } from '../../context.service';
import {
  Block,
  Collection,
  CollectionQueryResult,
  CollectionView,
  CollectionViewBlock,
  CollectionViewPageBlock,
} from 'notion-types';
import {
  getBlockCollectionId,
  getBlockParentPage,
  getTextContent,
} from 'notion-utils';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { AnPageIconComponent } from '../../components/page-icon.component';
import { AnCollectionViewTabComponent } from './collection-view-tab.component';
import { AnCollectionViewComponent } from './collection-view.component';

@Component({
  selector: 'an-collection-view-block',
  standalone: true,
  imports: [
    AnPageIconComponent,
    NgClass,
    AnCollectionViewTabComponent,
    AnCollectionViewComponent,
  ],
  template: `
    @if (params()) {
      <div>
        <div>
          @if (
            params()!.viewIds.length > 1 && ctx.showCollectionViewDropdown()
          ) {
            <an-collection-view-tab
              [collectionViewId]="params()!.collectionViewId"
              [viewIds]="params()!.viewIds"
              (onChangeView)="onChangeView($event)"
            />
          }
        </div>
        @if (titleParams()!.showTitle) {
          <div class="notion-collection-header">
            <div class="notion-collection-header-title">
              <an-page-icon
                [block]="block()"
                className="notion-page-title-icon"
                [hideDefaultIcon]="true"
              />
              {{ titleParams()!.title }}
            </div>
          </div>
        }
      </div>
      <div [ngClass]="['notion-collection', className()].join(' ')">
        <an-collection-view
          [collection]="params()!.collection"
          [collectionView]="params()!.collectionView"
          [collectionData]="params()!.collectionData"
          [padding]="styleSettings().padding"
          [width]="styleSettings().width"
        />
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
export class AnCollectionViewBlockComponent implements AfterViewInit, OnInit {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly className = input<string>('');
  readonly collectionState = signal<{ collectionViewId: string } | undefined>(
    undefined,
  );
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly windowsSize = signal<{ width: number }>({ width: 0 });
  readonly isMounted = signal<boolean>(true);
  readonly params = signal<null | {
    viewIds: string[];
    collectionViewId: string;
    collection: Collection;
    collectionView: CollectionView;
    collectionData: CollectionQueryResult;
  }>(null);
  readonly styleSettings = computed<{
    style: Record<string, string | number>;
    width: number;
    padding: number;
  }>(() => {
    const params = this.params();
    const block = this.block();
    const recordMap = this.ctx.recordMap();
    const windowsSize = this.windowsSize();
    const style: Record<string, string | number> = {};
    if (
      !params ||
      (params.collectionView?.type !== 'table' &&
        params.collectionView?.type !== 'board')
    ) {
      return {
        style,
        width: 0,
        padding: 0,
      };
    }
    const parentPage = getBlockParentPage(block, recordMap);
    const width = windowsSize.width;
    const maxNotionBodyWidth = 708;
    let notionBodyWidth: number;

    if (parentPage?.format?.page_full_width) {
      notionBodyWidth = (width - 2 * Math.min(96, width * 0.08)) | 0;
    } else {
      notionBodyWidth =
        width < maxNotionBodyWidth
          ? (width - width * 0.02) | 0 // 2vw
          : maxNotionBodyWidth;
    }

    const padding = !this.isBrowser ? 96 : ((width - notionBodyWidth) / 2) | 0;
    style['paddingLeft'] = padding;
    style['paddingRight'] = padding;

    return {
      style,
      width,
      padding,
    };
  });
  readonly titleParams = computed<null | {
    showTitle: string | false;
    title: string;
  }>(() => {
    const block = this.block();
    const params = this.params();
    if (!params) return null;
    const title = getTextContent(params.collection.name).trim();
    const showTitle =
      params.collectionView.format?.hide_linked_collection_name !== true &&
      title;
    if (params.collection.icon) {
      block.format = {
        ...block.format,
        page_icon: params.collection.icon,
      };
    }
    return {
      showTitle,
      title,
    };
  });

  constructor() {
    effect(
      () => {
        const block = this.block() as
          | CollectionViewBlock
          | CollectionViewPageBlock;
        const recordMap = this.ctx.recordMap();

        const viewIds = block.view_ids || [];
        const collectionId = getBlockCollectionId(block, recordMap);
        const defaultCollectionViewId = viewIds[0];
        if (!this.collectionState()) {
          this.collectionState.set({
            collectionViewId: defaultCollectionViewId,
          });
        }

        const collectionViewId =
          (this.isMounted() &&
            viewIds.find(
              (id: string) => id === this.collectionState()?.collectionViewId,
            )) ||
          defaultCollectionViewId;

        if (!collectionId) {
          this.params.set(null);
          return;
        }
        const collection = recordMap.collection[collectionId]?.value;
        const collectionView =
          recordMap.collection_view[collectionViewId]?.value;
        const collectionData =
          recordMap.collection_query[collectionId]?.[collectionViewId];

        if (!(collection && collectionView && collectionData)) {
          this.params.set(null);
          return null;
        }
        this.params.set({
          viewIds,
          collectionViewId,
          collection,
          collectionView,
          collectionData,
        });
        return;
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.isMounted.set(true);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.windowsSize.set({
        width: window.innerWidth,
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.isBrowser) {
      this.windowsSize.set({
        width: window.innerWidth,
      });
    }
  }

  onChangeView(collectionViewId: string) {
    console.log(collectionViewId);
    this.collectionState.set({
      ...this.collectionState(),
      collectionViewId,
    });
  }
}
