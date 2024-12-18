import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PropertyType } from 'notion-types';
import { AngularComponent } from '../type';
import { AnSvgTitleComponent } from './title-icon';
import { AnSvgTextComponent } from './text-icon';
import { AnSvgNumberComponent } from './number-icon';
import { AnSvgSelectComponent } from './select-icon';
import { AnSvgStatusComponent } from './status-icon';
import { AnSvgMultiSelectComponent } from './multi-select-icon';
import { AnSvgDateComponent } from './date-icon';
import { AnSvgPersonComponent } from './person-icon';
import { AnSvgFileComponent } from './file-icon';
import { AnSvgCheckboxComponent } from './checkbox-icon';
import { AnSvgUrlComponent } from './rurl-icon';
import { AnSvgEmailComponent } from './email-icon';
import { AnSvgPhoneNumberComponent } from './phone-number-icon';
import { AnSvgRelationComponent } from './relation-icon';
import { AnSvgTimestampComponent } from './timestamp-icon';
import { AnSvgPerson2Component } from './person-2-icon';
import { AnSvgFormulaComponent } from './formula-icon';

const iconMap = {
  title: AnSvgTitleComponent,
  text: AnSvgTextComponent,
  number: AnSvgNumberComponent,
  select: AnSvgSelectComponent,
  status: AnSvgStatusComponent,
  multi_select: AnSvgMultiSelectComponent,
  date: AnSvgDateComponent,
  person: AnSvgPersonComponent,
  file: AnSvgFileComponent,
  checkbox: AnSvgCheckboxComponent,
  url: AnSvgUrlComponent,
  email: AnSvgEmailComponent,
  phone_number: AnSvgPhoneNumberComponent,
  formula: AnSvgFormulaComponent,
  relation: AnSvgRelationComponent,
  created_time: AnSvgTimestampComponent,
  last_edited_time: AnSvgTimestampComponent,
  created_by: AnSvgPerson2Component,
  last_edited_by: AnSvgPerson2Component,
};

@Component({
  selector: 'an-property-icon',
  imports: [NgComponentOutlet],
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
  readonly type = input.required<PropertyType>();
  readonly className = input<string>('');

  readonly icon = computed<AngularComponent | null>(() => {
    return iconMap[this.type()] ?? null;
  });
}
