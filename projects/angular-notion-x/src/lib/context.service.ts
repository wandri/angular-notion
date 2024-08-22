import { Injectable, signal } from '@angular/core';
import { ExtendedRecordMap } from 'notion-types';
import {
  AngularComponent,
  MapImageUrlFn,
  MapPageUrlFn,
  NotionComponents,
  SearchNotionFn,
} from './type';

@Injectable({
  providedIn: 'root',
})
export class NotionContextService {
  readonly recordMap = signal<ExtendedRecordMap | undefined>(undefined);
  readonly components = signal<Partial<NotionComponents> | undefined>(
    undefined,
  );
  readonly mapPageUrl = signal<MapPageUrlFn>(() => '');
  readonly mapImageUrl = signal<MapImageUrlFn>(() => '');
  readonly searchNotion = signal<SearchNotionFn | undefined>(undefined);
  readonly isShowingSearch = signal<boolean | undefined>(undefined);
  readonly onHideSearch = signal<() => void>(() => {});
  readonly rootPageId = signal<string | undefined>(undefined);
  readonly rootDomain = signal<string | undefined>(undefined);
  readonly fullPage = signal<boolean | undefined>(undefined);
  readonly darkMode = signal<boolean | undefined>(undefined);
  readonly previewImages = signal<boolean | undefined>(undefined);
  readonly forceCustomImages = signal<boolean | undefined>(undefined);
  readonly showCollectionViewDropdown = signal<boolean | undefined>(undefined);
  readonly linkTableTitleProperties = signal<boolean | undefined>(undefined);
  readonly isLinkCollectionToUrlProperty = signal<boolean | undefined>(
    undefined,
  );
  readonly showTableOfContents = signal<boolean | undefined>(undefined);
  readonly minTableOfContentsItems = signal<number | undefined>(undefined);
  readonly defaultPageIcon = signal<string | undefined>(undefined);
  readonly defaultPageCover = signal<string | undefined>(undefined);
  readonly defaultPageCoverPosition = signal<number | undefined>(undefined);
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
  readonly disableHeader = signal<boolean | undefined>(undefined);
  readonly pageCoverStyleCache: Record<string, Record<string, string>> = {};
  readonly tocIndentLevelCache: Record<string, number> = {};
}
