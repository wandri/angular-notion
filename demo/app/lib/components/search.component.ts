import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Block } from 'notion-types';
import { NotionContextService } from '../context.service';
import { AnPageLinkComponent } from './link/page-link.component';
import { AnPageIconComponent } from './page-icon.component';
import { AngularComponent, SearchNotionFn } from '../type';
import { NgClass } from '@angular/common';
import { AnLinkIconComponent } from '../icons/search-icon';

@Component({
  selector: 'an-search',
  standalone: true,
  imports: [
    AnPageLinkComponent,
    AnPageIconComponent,
    NgClass,
    AnLinkIconComponent,
  ],
  template: `
    @if (hasSearch()) {
      <div
        role="button"
        [ngClass]="['breadcrumb', 'button', 'notion-search-button'].join(' ')"
        (click)="this.onOpenSearch()"
      >
        <an-search-icon className="searchIcon" />
        @if (title()) {
          <span class="title">{{ title() }}</span>
        }
      </div>
    }
    @if (isSearchOpen() && hasSearch()) {
      <!--      <an-search-dialog-->
      <!--        [isOpen]="isSearchOpen()"-->
      <!--        [rootBlockId]="ctx.rootPageId() || block()?.id"-->
      <!--        (onClose)="onCloseSearch($event)"-->
      <!--        (searchNotion)="onSearchNotion($event)"-->
      <!--      />-->
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnSearchComponent {
  ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly search = input<SearchNotionFn | undefined>(undefined);
  readonly title = input<AngularComponent | null>();
  readonly isSearchOpen = signal<boolean>(false);
  readonly hasSearch = computed(() => {
    const onSearchNotion = this.search() || this.ctx.searchNotion();
    const hasSearch = !!onSearchNotion;
    return {
      hasSearch,
    };
  });

  onOpenSearch() {
    this.isSearchOpen.set(true);
  }

  onCloseSearch($event: any) {
    this.isSearchOpen.set(false);
    if (this.ctx.onHideSearch()) {
      this.ctx.onHideSearch();
    }
  }

  async onSearchNotion($event: any) {
    const searchNotion = this.ctx.searchNotion();
    if (searchNotion) {
      await searchNotion($event);
    }
  }
}
