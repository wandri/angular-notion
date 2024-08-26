import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../../../context.service';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { AnTextComponent } from '../../../components/text/text';
import { AnPageLinkComponent } from '../../../components/link/page-link.component';
import { AnPageTitleComponent } from '../../../components/page-title.component';
import { AnLinkComponent } from '../../../components/link/link.component';
import { AnGracefulImageComponent } from '../../../components/graceful-image.component';
import { AnCheckboxComponent } from '../../../components/checkbox.component';
import formatter from 'format-number';
import { format } from 'date-fns/format';
import {
  Block,
  Collection,
  CollectionPropertySchema,
  Decoration,
} from 'notion-types';
import { evalFormula } from './eval-formula';

@Component({
  selector: 'an-default-property',
  standalone: true,
  imports: [
    NgComponentOutlet,
    NgClass,
    AnTextComponent,
    AnPageLinkComponent,
    AnPageTitleComponent,
    AnLinkComponent,
    AnGracefulImageComponent,
    AnCheckboxComponent,
  ],
  template: `
    <span [ngClass]="['notion-property', 'notion-property-' + schema()?.type]">
      @if (
        data() ||
        schema()?.type === 'checkbox' ||
        schema()?.type === 'title' ||
        schema()?.type === 'formula' ||
        schema()?.type === 'created_by' ||
        schema()?.type === 'last_edited_by' ||
        schema()?.type === 'created_time' ||
        schema()?.type === 'last_edited_time'
      ) {
        @if (schema()?.type === 'formula') {
          @if (params()) {
            {{ params() }}
          }
        } @else if (schema()?.type === 'title') {
          @if (block() && linkToTitlePage()) {
            <an-page-link
              [href]="ctx.mapPageUrl()(block()!.id)"
              [className]="'notion-page-link'"
              [component]="ctx.components().PageLink"
            >
              <an-page-title [block]="block()!" />
            </an-page-link>
          } @else {
            <an-text [block]="block()!" [value]="data()!" />
          }
        } @else if (
          schema()?.type === 'select' || schema()?.type === 'multi_select'
        ) {
          @if (params()) {
            @for (item of params(); track item) {
              <div
                [ngClass]="
                  [
                    'notion-property-' + schema()?.type + '-item',
                    item.color ? 'notion-item-' + item.color : '',
                  ].join(' ')
                "
              >
                {{ item.value }}
              </div>
            }
          }
        } @else if (schema()?.type === 'file') {
          @if (params()) {
            @for (file of params(); track file) {
              <an-link
                [component]="ctx.components().Link"
                className="notion-property-file"
                [href]="ctx.mapImageUrl()(file[2], block()!) ?? ''"
                target="_blank"
                rel="noreferrer noopener"
              >
                <an-graceful-image
                  [alt]="file[0]"
                  [src]="ctx.mapImageUrl()(file[2], block()!) ?? ''"
                  loading="lazy"
                />
              </an-link>
            }
          }
        } @else if (schema()?.type === 'checkbox') {
          @if (params()) {
            <div class="notion-property-checkbox-container">
              <an-checkbox [isChecked]="params()" [blockId]="undefined" />
              <span class="notion-property-checkbox-text">{{
                schema()?.name
              }}</span>
            </div>
          }
        } @else if (schema()?.type === 'url') {
          @if (params()) {
            <an-text
              [value]="params()"
              [block]="block()!"
              [inline]="inline()"
              [linkProps]="{
                target: '_blank',
                rel: 'noreferrer noopener',
              }"
            />
          }
        } @else if (schema()?.type === 'email') {
          <an-text [value]="data()!" linkProtocol="mailto" [block]="block()!" />
        } @else if (schema()?.type === 'phone_number') {
          <an-text [value]="data()!" linkProtocol="tel" [block]="block()!" />
        } @else if (schema()?.type === 'number') {
          @if (params()) {
            <an-text [value]="params()" [block]="block()!" />
          }
        } @else if (schema()?.type === 'created_time') {
          @if (params()) {
            {{ params() }}
          }
        } @else if (schema()?.type === 'last_edited_time') {
          @if (params()) {
            {{ params() }}
          }
        } @else if (schema()?.type === 'created_by') {
          @if (params()) {
            {{ params() }}
          }
        } @else if (schema()?.type === 'last_edited_by') {
          @if (params()) {
            {{ params() }}
          }
        } @else if (
          ['text', 'date', 'person', 'relation'].includes(schema()?.type ?? '')
        ) {
          <an-text [block]="block()!" [value]="data()!" />
        } @else {
          <an-text [block]="block()!" [value]="data()!" />
        }
      }
    </span>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnDefaultPropertyComponent {
  readonly ctx = inject(NotionContextService);
  readonly propertyId = input<string | undefined>(undefined);
  readonly schema = input<CollectionPropertySchema | undefined>(undefined);
  readonly data = input<undefined | Decoration[]>(undefined);
  readonly block = input<Block | undefined>(undefined);
  readonly collection = input<Collection | undefined>(undefined);
  readonly inline = input<boolean>(false);
  readonly linkToTitlePage = input<boolean>(true);
  readonly pageHeader = input<boolean>(false);

  readonly params = computed<any>(() => {
    const schema = this.schema();
    if (!schema) return null;
    const data = this.data();
    if (schema.type === 'url') {
      const d = <string[][]>data;
      if (this.inline()) {
        try {
          const url = new URL(d[0][0]);
          d[0][0] = url.hostname.replace(/^www\./, '');
          return d;
        } catch (err) {
          return '';
        }
      }
    } else if (schema.type === 'file') {
      return (
        data?.filter((v) => v.length === 2).map((f) => f.flat().flat()) ?? []
      );
    } else if (schema.type === 'formula') {
      let content = null;
      try {
        const formula = schema.formula;
        const collectionSchema = this.collection()?.schema;
        content =
          formula &&
          collectionSchema &&
          evalFormula(formula, {
            schema: collectionSchema,
            properties: this.block()?.properties,
          });

        if (isNaN(content as number)) {
          // console.log('NaN', schema.formula)
        }

        if (content instanceof Date) {
          content = format(content, 'MMM d, YYY hh:mm aa');
        }
      } catch (err) {
        // console.log('error evaluating formula', schema.formula, err)
        content = null;
      }

      return content;
    } else if (schema.type === 'select' || schema.type === 'multi_select') {
      const values = ((data && data[0][0]) || '').split(',');
      return values.map((value) => {
        const option = schema.options?.find((option) => value === option.value);
        return {
          value,
          color: option?.color,
        };
      });
    } else if (schema.type === 'checkbox') {
      return data && data[0][0] === 'Yes';
    } else if (schema.type === 'number') {
      const value = <number>(data && parseFloat(data[0][0] || '0'));
      let output = '';

      if (isNaN(value)) {
        return data;
      } else {
        switch (schema.number_format) {
          case 'number_with_commas':
            output = formatter()(value);
            break;
          case 'percent':
            output = formatter({ suffix: '%' })(value * 100);
            break;
          case 'dollar':
            output = formatter({ prefix: '$', round: 2, padRight: 2 })(value);
            break;
          case 'euro':
            output = formatter({ prefix: '€', round: 2, padRight: 2 })(value);
            break;
          case 'pound':
            output = formatter({ prefix: '£', round: 2, padRight: 2 })(value);
            break;
          case 'yen':
            output = formatter({ prefix: '¥', round: 0 })(value);
            break;
          case 'rupee':
            output = formatter({ prefix: '₹', round: 2, padRight: 2 })(value);
            break;
          case 'won':
            output = formatter({ prefix: '₩', round: 0 })(value);
            break;
          case 'yuan':
            output = formatter({ prefix: 'CN¥', round: 2, padRight: 2 })(value);
            break;
          default:
            return this.data();
        }

        return [[output]];
      }
    } else if (schema.type === 'created_time') {
      const createdTime = this.block()?.created_time ?? '';
      return format(new Date(createdTime), 'MMM d, yyy hh:mm aa');
    } else if (schema.type === 'last_edited_by') {
      const lastEditedTime = this.block()?.last_edited_time ?? '';
      return format(new Date(lastEditedTime), 'MMM d, yyy hh:mm aa');
    }

    return null;
  });
}
