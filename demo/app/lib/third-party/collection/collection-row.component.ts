import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  Block,
  Collection,
  CollectionPropertySchemaMap,
  PropertyID,
} from 'notion-types';
import { NotionContextService } from '../../context.service';
import { NgClass } from '@angular/common';
import { AnCollectionColumnTitleComponent } from './collection-column-title.component';
import { AnPropertyComponent } from './property/property.component';

@Component({
  selector: 'an-collection-row',
  standalone: true,
  imports: [NgClass, AnCollectionColumnTitleComponent, AnPropertyComponent],
  template: `
    @if (params()) {
      <div [ngClass]="['notion-collection-row', className()]">
        <div class="notion-collection-row-body">
          @for (propertyId of params()!.propertyIds; track propertyId) {
            <div class="notion-collection-row-property">
              <an-collection-column-title
                [schema]="params()!.schemas[propertyId]"
              />

              <div class="notion-collection-row-value">
                <an-property
                  [schema]="params()!.schemas[propertyId]"
                  [data]="block().properties?.[propertyId]"
                  [propertyId]="propertyId"
                  [block]="block()"
                  [collection]="params()!.collection"
                  [pageHeader]="pageHeader()"
                />
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionRowComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly className = input<string>('');
  readonly pageHeader = input<boolean>(false);

  readonly params = computed<null | {
    schemas: CollectionPropertySchemaMap;
    collection: Collection;
    propertyIds: PropertyID[];
  }>(() => {
    const collectionId = this.block().parent_id;
    const collection = this.ctx.recordMap().collection[collectionId]?.value;
    const schemas = collection?.schema;

    if (!collection || !schemas) {
      return null;
    }

    let propertyIds = Object.keys(schemas).filter((id) => id !== 'title');

    // filter properties based on visibility
    if (collection.format?.property_visibility) {
      propertyIds = propertyIds.filter(
        (id) =>
          collection.format?.property_visibility?.find(
            ({ property }) => property === id,
          )?.visibility !== 'hide',
      );
    }

    // sort properties
    if (collection.format?.collection_page_properties) {
      // sort properties based on collection page order
      const idToIndex: Record<string, number> =
        collection.format?.collection_page_properties.reduce(
          (acc, p, i) => ({
            ...acc,
            [p.property]: i,
          }),
          {},
        );

      propertyIds.sort((a, b) => idToIndex[a] - idToIndex[b]);
    } else {
      // default to sorting properties alphabetically based on name
      propertyIds.sort((a, b) =>
        schemas[a].name.localeCompare(schemas[b].name),
      );
    }

    return {
      collection,
      schemas: schemas,
      propertyIds,
    };
  });
}
