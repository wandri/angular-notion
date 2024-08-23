import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExtendedRecordMap } from 'notion-types';
import { AnNotionComponent } from './lib/an-notion/an-notion.component';
import { NotionClientService } from './lib/notion-client.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnNotionComponent],
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
