import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
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
import { BlockComponent } from '../block/block.component';
import { NotionBlockComponent } from '../notion-block/notion-block.component';
import { defaultNotionContext } from '../default-value';

@Component({
  selector: 'an-notion',
  standalone: true,
  imports: [BlockComponent, NotionBlockComponent],
  template: ` <an-notion-block [blockId]="blockId()" [level]="0" /> `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnNotionComponent {
  readonly recordMap = input<ExtendedRecordMap>(defaultNotionContext.recordMap);
  readonly components = input<Partial<NotionComponents> | undefined>(undefined);
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
    effect(
      () => {
        this.contextService.recordMap.set(this.recordMap());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.components.set(this.components());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.mapPageUrl.set(this.mapPageUrl());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.mapImageUrl.set(this.mapImageUrl());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.searchNotion.set(this.searchNotion());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.isShowingSearch.set(this.isShowingSearch());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.onHideSearch.set(this.onHideSearch());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.rootPageId.set(this.rootPageId());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.rootDomain.set(this.rootDomain());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.fullPage.set(this.fullPage());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.darkMode.set(this.darkMode());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.previewImages.set(this.previewImages());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.forceCustomImages.set(this.forceCustomImages());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.showCollectionViewDropdown.set(
          this.showCollectionViewDropdown(),
        );
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.linkTableTitleProperties.set(
          this.linkTableTitleProperties(),
        );
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.isLinkCollectionToUrlProperty.set(
          this.isLinkCollectionToUrlProperty(),
        );
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.showTableOfContents.set(this.showTableOfContents());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.minTableOfContentsItems.set(
          this.minTableOfContentsItems(),
        );
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.defaultPageIcon.set(this.defaultPageIcon());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.defaultPageCover.set(this.defaultPageCover());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.defaultPageCoverPosition.set(
          this.defaultPageCoverPosition(),
        );
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.className.set(this.className());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.bodyClassName.set(this.bodyClassName());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.header.set(this.header());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.footer.set(this.footer());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.pageHeader.set(this.pageHeader());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.pageFooter.set(this.pageFooter());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.pageTitle.set(this.pageTitle());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.pageAside.set(this.pageAside());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.pageCover.set(this.pageCover());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.blockId.set(this.blockId());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.hideBlockId.set(this.hideBlockId());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        this.contextService.disableHeader.set(this.disableHeader());
      },
      { allowSignalWrites: true },
    );
  }
}
