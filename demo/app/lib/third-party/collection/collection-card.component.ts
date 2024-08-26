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
  CollectionPropertySchema,
  ImageBlock,
  PropertyID,
} from 'notion-types';
import { NotionContextService } from '../../context.service';
import { getTextContent } from 'notion-utils';
import { AnLazyImageComponent } from '../../components/lazy-image.component';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AnLinkComponent } from '../../components/link/link.component';
import { AnPageLinkComponent } from '../../components/link/page-link.component';
import { AnPropertyComponent } from './property/property.component';

type Content = {
  type: 'property' | 'image' | 'file' | 'empty' | null;
  content: {
    src?: string;
    alt?: string;
    className?: string;
    caption?: string;
    style?: Record<string, string | number>;
    data?: any;
    schema?: CollectionPropertySchema;
    property?: any;
  };
} | null;

@Component({
  selector: 'an-collection-card',
  standalone: true,
  imports: [
    AnLazyImageComponent,
    NgStyle,
    NgClass,
    AnLinkComponent,
    NgTemplateOutlet,
    AnPageLinkComponent,
    AnPropertyComponent,
  ],
  template: `
    @if (this.ctx.isLinkCollectionToUrlProperty() && params().url) {
      <an-link
        [href]="params().url"
        [className]="
          [
            'notion-collection-card',
            'notion-collection-card-size-' + coverSize(),
            className(),
          ].join(' ')
        "
      >
        <ng-container *ngTemplateOutlet="innerCard" />
      </an-link>
    } @else {
      <an-page-link
        [href]="ctx.mapPageUrl()(block().id)"
        [className]="
          [
            'notion-collection-card',
            'notion-collection-card-size-' + coverSize(),
            className(),
          ].join(' ')
        "
      >
        <ng-container *ngTemplateOutlet="innerCard" />
      </an-page-link>
    }

    <ng-template #innerCard>
      @if (this.params()!.coverContent || cover()?.type !== 'none') {
        <div class="notion-collection-card-cover">
          @if (this.params()!.coverContent!.type === 'image') {
            <an-lazy-image
              [src]="this.params()!.coverContent!.content.src"
              [alt]="this.params()!.coverContent!.content.caption"
              [ngStyle]="this.params()!.coverContent!.content.style"
            />
          } @else if (this.params()!.coverContent!.type === 'file') {
            <span
              [ngClass]="this.params()!.coverContent!.content.className ?? ''"
            >
              <an-lazy-image
                [src]="this.params()!.coverContent!.content.src"
                [alt]="this.params()!.coverContent!.content.caption"
                [ngStyle]="this.params()!.coverContent!.content.style"
              />
            </span>
          } @else if (this.params()!.coverContent!.type === 'property') {
            <an-property
              [propertyId]="this.params()!.coverContent!.content.property"
              [schema]="this.params()!.coverContent!.content.schema"
              [data]="this.params()!.coverContent!.content.data"
            />
          } @else if (this.cover()?.type === 'empty') {
            <div class="notion-collection-card-cover-empty"></div>
          }
        </div>
      }

      <div class="notion-collection-card-body">
        <div class="notion-collection-card-property">
          <an-property
            [schema]="collection().schema['title']"
            [data]="block().properties.title"
            [block]="block()"
            [collection]="collection()"
          />
        </div>
        @for (p of filteredProperties(); track p) {
          <div class="notion-collection-card-property">
            <an-property
              [schema]="p.schema"
              [data]="p.data"
              [block]="block()"
              [collection]="collection()"
              [inline]="true"
            />
          </div>
        }
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionCardComponent {
  readonly ctx = inject(NotionContextService);
  readonly collection = input.required<Collection>();
  readonly block = input.required<Block>();
  readonly cover = input<any>(undefined);
  readonly coverSize = input<string | undefined>(undefined);
  readonly coverAspect = input<undefined | string>(undefined);
  readonly properties = input<
    {
      property: PropertyID;
      visible: boolean;
      schema: CollectionPropertySchema;
    }[]
  >([]);
  readonly className = input<string>('');

  readonly params = computed<{
    coverContent: Content;
    url: string;
  }>(() => {
    const block = this.block();
    const cover = this.cover();
    const recordMap = this.ctx.recordMap();
    const mapImageUrl = this.ctx.mapImageUrl();
    const collection = this.collection();
    const { page_cover_position = 0.5 } = block.format || {};
    const coverPosition = (1 - page_cover_position) * 100;
    let coverContent: Content = null;
    if (cover?.type === 'page_content') {
      const contentBlockId = block.content?.find((blockId) => {
        const block = recordMap.block[blockId]?.value;
        return block?.type === 'image';
      });

      if (contentBlockId) {
        const contentBlock = recordMap.block[contentBlockId]
          ?.value as ImageBlock;

        const source =
          contentBlock.properties?.source?.[0]?.[0] ??
          contentBlock.format?.display_source;

        if (source) {
          const src = mapImageUrl(source, contentBlock) ?? '';
          const caption = contentBlock.properties?.caption?.[0]?.[0];

          coverContent = {
            type: 'image',
            content: {
              src: src,
              caption: caption,
              style: {
                objectFit: this.coverAspect() ?? '',
              },
            },
          };
        }
      }

      if (!coverContent) {
        coverContent = {
          type: 'empty',
          content: {},
        };
      }
    } else if (cover?.type === 'page_cover') {
      const { page_cover } = block.format || {};

      if (page_cover) {
        const coverPosition = (1 - page_cover_position) * 100;
        coverContent = {
          type: 'image',
          content: {
            src: mapImageUrl(page_cover, block) ?? '',
            alt: getTextContent(block.properties?.title),
            style: {
              objectFit: this.coverAspect() ?? '',
              objectPosition: `center ${coverPosition}%`,
            },
          },
        };
      }
    } else if (cover?.type === 'property') {
      const { property } = cover;
      const schema = collection.schema[property];
      const data = block.properties?.[property];

      if (schema && data) {
        if (schema.type === 'file') {
          const files = data
            .filter((v: any[]) => v.length === 2)
            .map((f: any[][]) => f.flat().flat());
          const file = files[0];

          if (file) {
            coverContent = {
              type: 'file',
              content: {
                className: `notion-property-${schema.type}`,
                alt: file[0],
                src: mapImageUrl(file[2], block) ?? '',
                style: {
                  objectFit: this.coverAspect() ?? '',
                  objectPosition: `center ${coverPosition}%`,
                },
              },
            };
          }
        } else {
          coverContent = {
            type: 'property',
            content: {
              data: data,
              schema: schema,
            },
          };
        }
      }
    }
    let linkProperties = [];
    if (this.ctx.isLinkCollectionToUrlProperty()) {
      linkProperties = this.properties()
        ?.filter(
          (p) =>
            p.visible &&
            p.property !== 'title' &&
            collection.schema[p.property],
        )
        .filter((p) => {
          if (!block.properties) return false;
          const schema = collection.schema[p.property];

          return schema.type == 'url';
        })
        .map((p) => {
          return block.properties[p.property];
        })
        ?.filter((p) => p && p.length > 0 && p[0] != undefined); //case where the url is empty
    }
    let url = null;
    if (
      linkProperties &&
      linkProperties.length > 0 &&
      linkProperties[0].length > 0 &&
      linkProperties[0][0].length > 0
    ) {
      url = linkProperties[0][0][0];
    }

    return {
      coverContent,
      url,
    };
  });

  readonly filteredProperties = computed<
    { schema: CollectionPropertySchema; data: any }[]
  >(() => {
    const block = this.block();
    return this.properties()
      ?.filter(
        (p) =>
          p.visible &&
          p.property !== 'title' &&
          this.collection().schema[p.property],
      )
      .map((p) => {
        if (!block.properties) return null;
        const schema = this.collection().schema[p.property];
        const data = block.properties[p.property];
        return {
          schema,
          data,
        };
      })
      .filter((p) => p !== null);
  });
}
