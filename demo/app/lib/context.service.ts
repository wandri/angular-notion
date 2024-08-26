import { Injectable, signal } from '@angular/core';
import { ExtendedRecordMap } from 'notion-types';
import {
  AngularComponent,
  MapImageUrlFn,
  MapPageUrlFn,
  NotionComponents,
  SearchNotionFn,
} from './type';
import { defaultComponents, defaultNotionContext } from './default-value';

@Injectable({
  providedIn: 'root',
})
export class NotionContextService {
  readonly recordMap = signal<ExtendedRecordMap>(
    defaultNotionContext.recordMap,
  );
  readonly components = signal<Partial<NotionComponents>>(defaultComponents);
  readonly mapPageUrl = signal<MapPageUrlFn>(defaultNotionContext.mapPageUrl);
  readonly mapImageUrl = signal<MapImageUrlFn>(
    defaultNotionContext.mapImageUrl,
  );
  readonly searchNotion = signal<SearchNotionFn | undefined>(
    defaultNotionContext.searchNotion,
  );
  readonly isShowingSearch = signal<boolean | undefined>(
    defaultNotionContext.isShowingSearch,
  );
  readonly onHideSearch = signal<undefined | (() => void)>(
    defaultNotionContext.onHideSearch,
  );
  readonly rootPageId = signal<string | undefined>(
    defaultNotionContext.rootPageId,
  );
  readonly rootDomain = signal<string | undefined>(
    defaultNotionContext.rootDomain,
  );
  readonly fullPage = signal<boolean | undefined>(
    defaultNotionContext.fullPage,
  );
  readonly darkMode = signal<boolean | undefined>(
    defaultNotionContext.darkMode,
  );
  readonly previewImages = signal<boolean | undefined>(
    defaultNotionContext.previewImages,
  );
  readonly forceCustomImages = signal<boolean | undefined>(
    defaultNotionContext.forceCustomImages,
  );
  readonly showCollectionViewDropdown = signal<boolean | undefined>(
    defaultNotionContext.showCollectionViewDropdown,
  );
  readonly linkTableTitleProperties = signal<boolean>(
    defaultNotionContext.linkTableTitleProperties,
  );
  readonly isLinkCollectionToUrlProperty = signal<boolean | undefined>(
    defaultNotionContext.isLinkCollectionToUrlProperty,
  );
  readonly showTableOfContents = signal<boolean | undefined>(
    defaultNotionContext.showTableOfContents,
  );
  readonly minTableOfContentsItems = signal<number | undefined>(
    defaultNotionContext.minTableOfContentsItems,
  );
  readonly defaultPageIcon = signal<string | undefined>(
    defaultNotionContext.defaultPageIcon,
  );
  readonly defaultPageCover = signal<string | undefined>(
    defaultNotionContext.defaultPageCover,
  );
  readonly defaultPageCoverPosition = signal<number | undefined>(
    defaultNotionContext.defaultPageCoverPosition,
  );
  readonly zoom = signal<boolean>(defaultNotionContext.zoom);
  readonly className = signal<string>('');
  readonly bodyClassName = signal<string | undefined>(undefined);
  readonly header = signal<AngularComponent>(null);
  readonly footer = signal<AngularComponent>(null);
  readonly pageHeader = signal<AngularComponent>(null);
  readonly pageFooter = signal<AngularComponent>(null);
  readonly pageTitle = signal<AngularComponent>(null);
  readonly pageAside = signal<AngularComponent>(null);
  readonly pageCover = signal<AngularComponent>(null);
  readonly blockId = signal<string | undefined>(undefined);
  readonly hideBlockId = signal<boolean | undefined>(undefined);
  readonly disableHeader = signal<boolean>(false);
  readonly pageCoverStyleCache: Record<string, Record<string, string>> = {};
  readonly tocIndentLevelCache: Record<string, number> = {};
}
