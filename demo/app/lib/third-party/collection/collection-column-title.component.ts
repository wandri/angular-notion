import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CollectionPropertySchema } from 'notion-types';
import { AnPropertyIconComponent } from '../../icons/property-icon';

@Component({
  selector: 'an-collection-column-title',
  imports: [AnPropertyIconComponent],
  template: `
    <div class="notion-collection-column-title">
      <an-property-icon
        className="notion-collection-column-title-icon"
        [type]="schema().type"
      />

      <div class="notion-collection-column-title-body">{{ schema().name }}</div>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnCollectionColumnTitleComponent {
  readonly schema = input.required<CollectionPropertySchema>();
}
