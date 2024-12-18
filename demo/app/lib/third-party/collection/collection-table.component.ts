import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  Collection,
  CollectionPropertySchema,
  CollectionView,
  PropertyID,
} from 'notion-types';
import { NgClass, NgStyle } from '@angular/common';
import { NotionContextService } from '../../context.service';
import { AnPropertyComponent } from './property/property.component';
import { AnCollectionColumnTitleComponent } from './collection-column-title.component';

@Component({
  selector: 'an-collection-table',
  imports: [
    NgStyle,
    NgClass,
    AnPropertyComponent,
    AnCollectionColumnTitleComponent,
  ],
  template: `
    <div class="notion-table" [ngStyle]="tableStyle()">
      <div class="notion-table-view" [ngStyle]="tableViewStyle()">
        @if (!!properties().length) {
          <div class="notion-table-header">
            <div class="notion-table-header-inner">
              @for (p of properties(); track p.property) {
                <div class="notion-table-th">
                  <div
                    class="notion-table-view-header-cell"
                    [ngStyle]="p.style"
                  >
                    <div class="notion-table-view-header-cell-inner">
                      <an-collection-column-title [schema]="p.schema" />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="notion-table-header-placeholder"></div>

          <div class="notion-table-body">
            @for (blockId of blockIds(); track blockId) {
              <div class="notion-table-row">
                @for (p of properties(); track p.property) {
                  <div
                    [ngClass]="[
                      'notion-table-cell',
                      'notion-table-cell-' + p.schema.type,
                    ]"
                    [ngStyle]="p.style"
                  >
                    <an-property
                      [schema]="p.schema"
                      [data]="
                        ctx.recordMap().block[blockId].value.properties &&
                        ctx.recordMap().block[blockId].value.properties[
                          p.property
                        ]
                      "
                      [block]="ctx.recordMap().block[blockId].value"
                      [collection]="collection()"
                      [linkToTitlePage]="ctx.linkTableTitleProperties()"
                    />
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionTableComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly collectionView = input.required<CollectionView | undefined>();
  readonly blockIds = input<string[] | undefined>([]);
  readonly padding = input.required<number>();
  readonly width = input.required<number>();

  readonly properties = computed<
    {
      property: PropertyID;
      visible: boolean;
      schema: CollectionPropertySchema;
      width: number;
      style: Record<string, string>;
    }[]
  >(() => {
    let properties: any[];
    const collectionView = this.collectionView();
    if (collectionView?.format?.table_properties) {
      properties = collectionView?.format.table_properties.filter(
        (p: { property: PropertyID; visible: boolean; width: number }) =>
          p.visible && this.collection().schema[p.property],
      );
    } else {
      properties = [{ property: 'title' }].concat(
        Object.keys(this.collection().schema)
          .filter((p) => p !== 'title')
          .map((property) => ({ property })),
      );
    }

    properties.forEach((p) => {
      const schema = this.collection().schema?.[p.property];
      const isTitle = p.property === 'title';
      const style: { width: string } = { width: '200px' };

      if (p.width) {
        style.width = `${p.width}px`;
      } else if (isTitle) {
        style.width = '280px';
      } else {
        style.width = '200px';
      }

      p.style = style;
      p.schema = schema;
    });

    return properties;
  });

  readonly tableStyle = computed<{ width: string; maxWidth: string }>(() => ({
    width: `${this.width()}px`,
    maxWidth: `${this.width()}px`,
  }));
  readonly tableViewStyle = computed<{
    paddingLeft: string;
    paddingRight: string;
  }>(() => ({
    paddingLeft: `${this.padding()}px`,
    paddingRight: `${this.padding()}px`,
  }));
}
