import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { ExtendedRecordMap } from 'notion-types';
import { NotionContextService } from '../context.service';
import {
  AngularComponent,
  MapImageUrlFn,
  MapPageUrlFn,
  NotionComponents,
  SearchNotionFn,
} from '../type';
import { NotionBlockComponent } from '../notion-block/notion-block.component';
import { defaultComponents, defaultNotionContext } from '../default-value';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

@Component({
  selector: 'an-notion',
  imports: [NotionBlockComponent],
  template: ` <an-notion-block [level]="0" /> `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnNotionComponent {
  readonly recordMap = input<ExtendedRecordMap>(defaultNotionContext.recordMap);
  readonly components = input<Partial<NotionComponents> | {}>({});
  readonly mapPageUrl = input<MapPageUrlFn>(defaultNotionContext.mapPageUrl);
  readonly mapImageUrl = input<MapImageUrlFn>(defaultNotionContext.mapImageUrl);
  readonly searchNotion = input<SearchNotionFn | undefined>(
    defaultNotionContext.searchNotion,
  );
  readonly isShowingSearch = input<boolean | undefined>(
    defaultNotionContext.isShowingSearch,
  );
  readonly onHideSearch = input<undefined | (() => void)>(
    defaultNotionContext.onHideSearch,
  );
  readonly rootPageId = input<string | undefined>(
    defaultNotionContext.rootPageId,
  );
  readonly rootDomain = input<string | undefined>(
    defaultNotionContext.rootDomain,
  );
  readonly fullPage = input<boolean | undefined>(defaultNotionContext.fullPage);
  readonly darkMode = input<boolean | undefined>(defaultNotionContext.darkMode);
  readonly previewImages = input<boolean | undefined>(
    defaultNotionContext.previewImages,
  );
  readonly forceCustomImages = input<boolean | undefined>(
    defaultNotionContext.forceCustomImages,
  );
  readonly showCollectionViewDropdown = input<boolean | undefined>(
    defaultNotionContext.showCollectionViewDropdown,
  );
  readonly linkTableTitleProperties = input<boolean | undefined>(
    defaultNotionContext.linkTableTitleProperties,
  );
  readonly isLinkCollectionToUrlProperty = input<boolean | undefined>(
    defaultNotionContext.isLinkCollectionToUrlProperty,
  );
  readonly showTableOfContents = input<boolean | undefined>(
    defaultNotionContext.showTableOfContents,
  );
  readonly minTableOfContentsItems = input<number | undefined>(
    defaultNotionContext.minTableOfContentsItems,
  );
  readonly defaultPageIcon = input<string | undefined>(
    defaultNotionContext.defaultPageIcon,
  );
  readonly defaultPageCover = input<string | undefined>(
    defaultNotionContext.defaultPageCover,
  );
  readonly defaultPageCoverPosition = input<number | undefined>(
    defaultNotionContext.defaultPageCoverPosition,
  );
  readonly className = input<string>('');
  readonly bodyClassName = input<string | undefined>(undefined);
  readonly header = input<AngularComponent>(null);
  readonly footer = input<AngularComponent>(null);
  readonly pageHeader = input<AngularComponent>(null);
  readonly pageFooter = input<AngularComponent>(null);
  readonly pageTitle = input<AngularComponent>(null);
  readonly pageAside = input<AngularComponent>(null);
  readonly pageCover = input<AngularComponent>(null);
  readonly blockId = input<string | undefined>(undefined);
  readonly hideBlockId = input<boolean | undefined>(undefined);
  readonly disableHeader = input<boolean>(false);
  private contextService = inject(NotionContextService);

  constructor() {
    TimeAgo.addLocale(en);
    effect(() => {
      this.contextService.recordMap.set(this.recordMap());
    });
    effect(() => {
      this.contextService.components.set({
        ...defaultComponents,
        ...this.components(),
      });
    });
    effect(() => {
      this.contextService.mapPageUrl.set(this.mapPageUrl());
    });
    effect(() => {
      this.contextService.mapImageUrl.set(this.mapImageUrl());
    });
    effect(() => {
      this.contextService.searchNotion.set(this.searchNotion());
    });
    effect(() => {
      this.contextService.isShowingSearch.set(this.isShowingSearch());
    });
    effect(() => {
      this.contextService.onHideSearch.set(this.onHideSearch());
    });
    effect(() => {
      this.contextService.rootPageId.set(this.rootPageId());
    });
    effect(() => {
      this.contextService.rootDomain.set(this.rootDomain());
    });
    effect(() => {
      this.contextService.fullPage.set(this.fullPage());
    });
    effect(() => {
      this.contextService.darkMode.set(this.darkMode());
    });
    effect(() => {
      this.contextService.previewImages.set(this.previewImages());
    });
    effect(() => {
      this.contextService.forceCustomImages.set(this.forceCustomImages());
    });
    effect(() => {
      this.contextService.showCollectionViewDropdown.set(
        this.showCollectionViewDropdown(),
      );
    });
    effect(() => {
      this.contextService.linkTableTitleProperties.set(
        !!this.linkTableTitleProperties(),
      );
    });
    effect(() => {
      this.contextService.isLinkCollectionToUrlProperty.set(
        this.isLinkCollectionToUrlProperty(),
      );
    });
    effect(() => {
      this.contextService.showTableOfContents.set(this.showTableOfContents());
    });
    effect(() => {
      this.contextService.minTableOfContentsItems.set(
        this.minTableOfContentsItems(),
      );
    });
    effect(() => {
      this.contextService.defaultPageIcon.set(this.defaultPageIcon());
    });
    effect(() => {
      this.contextService.defaultPageCover.set(this.defaultPageCover());
    });
    effect(() => {
      this.contextService.defaultPageCoverPosition.set(
        this.defaultPageCoverPosition(),
      );
    });
    effect(() => {
      this.contextService.className.set(this.className());
    });
    effect(() => {
      this.contextService.bodyClassName.set(this.bodyClassName());
    });
    effect(() => {
      this.contextService.header.set(this.header());
    });
    effect(() => {
      this.contextService.footer.set(this.footer());
    });
    effect(() => {
      this.contextService.pageHeader.set(this.pageHeader());
    });
    effect(() => {
      this.contextService.pageFooter.set(this.pageFooter());
    });
    effect(() => {
      this.contextService.pageTitle.set(this.pageTitle());
    });
    effect(() => {
      this.contextService.pageAside.set(this.pageAside());
    });
    effect(() => {
      this.contextService.pageCover.set(this.pageCover());
    });
    effect(() => {
      this.contextService.blockId.set(this.blockId());
    });
    effect(() => {
      this.contextService.hideBlockId.set(this.hideBlockId());
    });
    effect(() => {
      this.contextService.disableHeader.set(this.disableHeader());
    });
  }
}
