import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Collection, CollectionView } from 'notion-types';
import { AnCollectionViewTableComponent } from './collection-view-table.component';
import { AnCollectionViewListComponent } from './collection-view-list.component';
import {
  AnCollectionBoardComponent,
  AnCollectionViewBoardComponent,
} from './collection-view-board.component';
import { AnCollectionViewGalleryComponent } from './collection-view-gallery.component';

@Component({
  selector: 'an-collection-view',
  standalone: true,
  imports: [
    AnCollectionViewTableComponent,
    AnCollectionViewGalleryComponent,
    AnCollectionViewListComponent,
    AnCollectionBoardComponent,
    AnCollectionViewBoardComponent,
  ],
  template: `
    @switch (collectionView()?.type) {
      @case ('table') {
        <an-collection-view-table
          [collectionView]="collectionView()"
          [collection]="collection()"
          [collectionData]="collectionData()"
          [padding]="padding()"
          [width]="width()"
        />
      }
      @case ('list') {
        <an-collection-view-list
          [collectionView]="collectionView()"
          [collection]="collection()"
          [collectionData]="collectionData()"
        />
      }
      @case ('gallery') {
        <an-collection-view-gallery
          [collectionView]="collectionView()"
          [collection]="collection()"
          [collectionData]="collectionData()"
        />
      }
      @case ('board') {
        <an-collection-view-board
          [collectionView]="collectionView()"
          [collection]="collection()"
          [collectionData]="collectionData()"
          [padding]="padding()"
        />
      }
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionViewComponent {
  readonly collection = input.required<Collection>();
  readonly collectionView = input<CollectionView | undefined>();
  readonly collectionData = input.required<any>();
  readonly padding = input.required<number>();
  readonly width = input.required<number>();
}
