import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AnNotionComponent,
  NotionClientService,
} from '../../dist/angular-notion-x';
import { ExtendedRecordMap } from 'notion-types';
import { getPageTitle } from 'notion-utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnNotionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private notionClient = inject(NotionClientService);
  readonly recordMap = signal<undefined | ExtendedRecordMap>(undefined);
  readonly title = signal<string | undefined>(undefined);
  readonly pageId = '067dd719a912471ea9a3ac10710e7fdf';

  ngOnInit() {
    this.notionClient.setConfig({});
    this.notionClient.getPage(this.pageId).subscribe((page) => {
      this.recordMap.set(page);
      this.title.set(getPageTitle(page));
      console.log('ngOnInit', page);
    });
  }
}
