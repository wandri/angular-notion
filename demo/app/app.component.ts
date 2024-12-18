import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExtendedRecordMap } from 'notion-types';
import { NotionClientService } from './lib/notion-client.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: '',
})
export class AppComponent implements OnInit {
  readonly recordMap = signal<undefined | ExtendedRecordMap>(undefined);
  private notionClient = inject(NotionClientService);

  ngOnInit() {
    this.notionClient.setConfig({});
  }
}
