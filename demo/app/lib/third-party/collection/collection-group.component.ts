import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Collection, CollectionPropertySchema } from 'notion-types';
import { NgClass, NgStyle } from '@angular/common';
import { AnPropertyComponent } from './property/property.component';

@Component({
  selector: 'an-collection-group',
  imports: [NgStyle, NgClass, AnPropertyComponent],
  template: `
    @if (!hidden()) {
      <details
        [open]="true"
        class="notion-collection-group"
        [ngStyle]="detailsProps()?.style ?? {}"
        [ngClass]="detailsProps()?.className ?? ''"
      >
        <summary
          class="notion-collection-group-title"
          [ngStyle]="summaryProps()?.style ?? {}"
          [ngClass]="summaryProps()?.className ?? ''"
        >
          <div>
            <an-property
              [schema]="schema()"
              [data]="[[value()]]"
              [collection]="collection()"
            />

            <span class="notion-board-th-count">
              {{ collectionGroup()?.total }}
            </span>
          </div>
        </summary>

        <ng-content />
      </details>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionGroupComponent {
  readonly collection = input.required<Collection | undefined>();
  readonly collectionGroup = input<any | undefined>(undefined);
  readonly schema = input<CollectionPropertySchema | undefined>(undefined);
  readonly value = input<any | undefined>(undefined);
  readonly hidden = input<boolean>(false);
  readonly summaryProps = input<
    | undefined
    | {
        style?: Record<string, string | number>;
        className?: string;
      }
  >({ style: {}, className: '' });
  readonly detailsProps = input<
    | undefined
    | {
        style?: Record<string, string | number>;
        className?: string;
      }
  >({ style: {}, className: '' });
}
