import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { AnNotionComponent } from './lib/an-notion/an-notion.component';
import { ExtendedRecordMap } from 'notion-types';
import { NotionClientService } from './lib/notion-client.service';
import { getPageTitle } from 'notion-utils';
import { AnPdfComponent } from './lib/third-party/pdf.component';
import { AnTweetComponent } from './lib/third-party/tweet/tweet.component';
import { AnCollectionComponent } from './lib/third-party/collection/collection.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'an-page-demo',
  imports: [AnNotionComponent],
  template: `
    @if (recordMap()) {
      <an-notion
        [recordMap]="recordMap()!"
        [fullPage]="true"
        [darkMode]="false"
        [rootPageId]="pageId() ?? defaultId"
        [components]="{
          Pdf: AnPdfComponent,
          Tweet: AnTweetComponent,
          Collection: AnCollectionComponent,
        }"
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
export class PageComponent {
  readonly recordMap = signal<undefined | ExtendedRecordMap>(undefined);
  readonly title = signal<string | undefined>(undefined);
  readonly pageId = input<string | undefined>(undefined);
  readonly defaultId = '067dd719a912471ea9a3ac10710e7fdf';
  protected readonly AnPdfComponent = AnPdfComponent;
  protected readonly AnTweetComponent = AnTweetComponent;
  protected readonly AnCollectionComponent = AnCollectionComponent;
  private notionClient = inject(NotionClientService);

  constructor() {
    effect(() => {
      const pageId = this.pageId() ?? this.defaultId;
      this.notionClient.getPage(pageId).subscribe((page) => {
        this.recordMap.set(page);
        this.title.set(getPageTitle(page));
      });
    });
  }
}
