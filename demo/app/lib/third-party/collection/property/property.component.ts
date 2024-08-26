import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../../../context.service';
import { NgComponentOutlet } from '@angular/common';
import {
  Block,
  Collection,
  CollectionPropertySchema,
  Decoration,
} from 'notion-types';
import { AnDefaultPropertyComponent } from './default-property.component';

@Component({
  selector: 'an-property',
  standalone: true,
  imports: [NgComponentOutlet, AnDefaultPropertyComponent],
  template: `
    @if (ctx.components().Property) {
      <ng-container
        *ngComponentOutlet="
          ctx.components().Property ?? null;
          inputs: {
            propertyId: propertyId(),
            schema: schema(),
            data: data(),
            block: block(),
            collection: collection(),
            inline: inline(),
            linkToTitlePage: linkToTitlePage(),
            pageHeader: pageHeader(),
          }
        "
      />
    } @else {
      <an-default-property
        [propertyId]="propertyId()"
        [schema]="schema()"
        [data]="data()"
        [block]="block()"
        [collection]="collection()"
        [inline]="inline()"
        [linkToTitlePage]="linkToTitlePage()"
        [pageHeader]="pageHeader()"
      />
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPropertyComponent {
  readonly ctx = inject(NotionContextService);
  readonly propertyId = input<string | undefined>(undefined);
  readonly schema = input<CollectionPropertySchema | undefined>(undefined);
  readonly data = input<undefined | Decoration[]>(undefined);
  readonly block = input<Block | undefined>(undefined);
  readonly collection = input<Collection | undefined>(undefined);
  readonly inline = input<boolean>(false);
  readonly linkToTitlePage = input<boolean>(true);
  readonly pageHeader = input<boolean>(false);
}
