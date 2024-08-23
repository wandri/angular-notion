import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableOfContentsEntry, uuidToId } from 'notion-utils';
import { AngularComponent } from '../type';
import { NgClass, NgComponentOutlet, NgStyle } from '@angular/common';

@Component({
  selector: 'an-page-aside',
  standalone: true,
  imports: [NgClass, NgComponentOutlet, NgStyle],
  template: ` @if (hasAside()) {
    <aside [ngClass]="['notion-aside', className()]">
      @if (hasToc()) {
        <div class="notion-aside-table-of-contents">
          <div class="notion-aside-table-of-contents-header">
            Table of Contents
          </div>

          <nav class="notion-table-of-contents">
            @for (tocItem of toc(); track tocItem) {
              @let itemId = uuidToId(tocItem.id);
              <a
                [href]="'#' + itemId"
                [ngClass]="[
                  'notion-table-of-contents-item',
                  'notion-table-of-contents-item-indent-level-' +
                    tocItem.indentLevel,
                  activeSection() === itemId &&
                    'notion-table-of-contents-active-item',
                ]"
              >
                <span
                  class="notion-table-of-contents-item-body"
                  [ngStyle]="{
                    display: 'inline-block',
                    marginLeft: tocItem.indentLevel * 16,
                  }"
                  >{{ tocItem.text }}</span
                >
              </a>
            }
          </nav>
        </div>
      }

      <ng-container *ngComponentOutlet="pageAside()" />
    </aside>
  }`,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnPageAsideComponent {
  readonly toc = input.required<Array<TableOfContentsEntry>>();
  readonly activeSection = input.required<string | null>();
  readonly setActiveSection =
    input.required<(activeSection: string | null) => unknown>();
  readonly hasToc = input.required<boolean>();
  readonly hasAside = input.required<boolean>();
  readonly pageAside = input<AngularComponent>(null);
  readonly className = input<string>('');
  protected readonly uuidToId = uuidToId;
}
