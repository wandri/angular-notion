import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { NgClass } from '@angular/common';
import { AnTextComponent } from '../components/text/text';
import { AnCheckboxComponent } from '../components/checkbox.component';

@Component({
  selector: 'an-todo-block',
  imports: [AnCheckboxComponent, NgClass, AnTextComponent],
  template: `
    <div [ngClass]="['notion-to-do', blockId()]">
      <div class="notion-to-do-item">
        <an-checkbox
          [blockId]="blockId()"
          [isChecked]="block().properties?.checked?.[0]?.[0] === 'Yes'"
        />
        <div
          [ngClass]="[
            'notion-to-do-body',
            block().properties?.checked?.[0]?.[0] === 'Yes'
              ? 'notion-to-do-checked'
              : '',
          ]"
        >
          <an-text [value]="block().properties?.title" [block]="block()" />
        </div>
      </div>
      <div class="notion-to-do-children">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnTodoBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();
}
