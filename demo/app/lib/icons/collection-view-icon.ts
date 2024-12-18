import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AngularComponent } from '../type';
import { AnSvgCollectionViewCalendarIconComponent } from './collection-view-table-calendar';
import { AnSvgCollectionViewBoardIconComponent } from './collection-view-board-icon';
import { AnSvgCollectionViewListIconComponent } from './collection-view-list-icon';
import { AnSvgCollectionViewTableComponent } from './collection-view-table-icon';
import { AnSvgCollectionViewGalleryIconComponent } from './collection-view-gallery-icon';

const iconMap: Record<string, AngularComponent> = {
  table: AnSvgCollectionViewTableComponent,
  board: AnSvgCollectionViewBoardIconComponent,
  gallery: AnSvgCollectionViewGalleryIconComponent,
  list: AnSvgCollectionViewListIconComponent,
  calendar: AnSvgCollectionViewCalendarIconComponent,
};

@Component({
  selector: 'an-collection-view-icon',
  imports: [],
  template: ` <ng-container
    *ngComponentOutlet="icon(); inputs: { className: className() }"
  />`,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPropertyIconComponent {
  readonly type = input.required<string>();
  readonly className = input<string>('');

  readonly icon = computed<AngularComponent | null>(() => {
    return iconMap[this.type()] ?? null;
  });
}
