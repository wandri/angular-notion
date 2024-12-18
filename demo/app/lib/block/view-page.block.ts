import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { NgClass, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  getBlockCollectionId,
  getBlockIcon,
  getPageTableOfContents,
  getTextContent,
  isUrl,
} from 'notion-utils';
import { AnLazyImageComponent } from '../components/lazy-image.component';
import { AnPageAsideComponent } from '../components/page-aside.component';
import { AnPageIconComponent } from '../components/page-icon.component';
import { AnPageTitleComponent } from '../components/page-title.component';
import { AnTextComponent } from '../components/text/text';
import * as types from 'notion-types';
import { Block } from 'notion-types';
import { AngularComponent } from '../type';
import { AnPageLinkComponent } from '../components/link/page-link.component';

@Component({
  selector: 'an-view-page-block',
  imports: [
    NgClass,
    AnLazyImageComponent,
    AnPageAsideComponent,
    AnPageIconComponent,
    AnPageTitleComponent,
    AnTextComponent,
    NgComponentOutlet,
    NgTemplateOutlet,
    AnPageLinkComponent,
  ],
  template: `
    @if (level() === 0) {
      @if (ctx.fullPage()) {
        <div
          [ngClass]="[
            'notion',
            'notion-app',
            this.ctx.darkMode() ? 'dark-mode' : 'light-mode',
            this.blockId() ?? '',
            this.className(),
          ]"
        >
          <div class="notion-viewport"></div>

          <div class="notion-frame">
            @if (!this.disableHeader()) {
              <ng-container
                *ngComponentOutlet="
                  ctx.components()?.Header ?? null;
                  inputs: { block: block() }
                "
              />
            }
            <ng-container *ngComponentOutlet="header()" />
            <div class="notion-page-scroller">
              @if (this.fullPageProperties().hasPageCover) {
                @if (this.pageCover()) {
                  <ng-container *ngComponentOutlet="this.pageCover() ?? null" />
                } @else {
                  <div class="notion-page-cover-wrapper">
                    @if (blockFormat().page_cover) {
                      <an-lazy-image
                        [src]="
                          ctx.mapImageUrl()(
                            blockFormat().page_cover!,
                            block()
                          ) ?? ''
                        "
                        [alt]="
                          getTextContent(fullPageProperties().property?.title)
                        "
                        [priority]="true"
                        className="notion-page-cover"
                        [style]="fullPageProperties().pageCoverStyle"
                      />
                    }
                  </div>
                }
              }

              <main
                [ngClass]="[
                  'notion-page',
                  fullPageProperties().hasPageCover
                    ? 'notion-page-has-cover'
                    : 'notion-page-no-cover',
                  blockFormat().page_icon
                    ? 'notion-page-has-icon'
                    : 'notion-page-no-icon',
                  fullPageProperties().isPageIconUrl
                    ? 'notion-page-has-image-icon'
                    : 'notion-page-has-text-icon',
                  'notion-full-page',
                  blockFormat().page_full_width ? 'notion-full-width' : '',
                  blockFormat().page_small_text ? 'notion-small-text' : '',
                  bodyClassName(),
                ]"
              >
                @if (blockFormat().page_icon) {
                  <an-page-icon
                    [block]="block()"
                    [inline]="false"
                    [defaultIcon]="ctx.defaultPageIcon()"
                  />
                }

                <ng-container *ngComponentOutlet="pageHeader()" />

                <h1 class="notion-title">
                  @if (pageTitle()) {
                    <ng-container *ngComponentOutlet="pageTitle()" />
                  } @else {
                    <an-text
                      [value]="fullPageProperties().property?.title ?? []"
                      [block]="block()"
                    />
                  }
                </h1>

                @if (
                  block().type === 'collection_view_page' ||
                  (block().type === 'page' &&
                    block().parent_table === 'collection')
                ) {
                  <ng-container
                    *ngComponentOutlet="
                      ctx.components()?.Collection ?? null;
                      inputs: { block: block() }
                    "
                  />
                }
                @if (block().type !== 'collection_view_page') {
                  <div
                    [ngClass]="[
                      'notion-page-content',
                      fullPageProperties().hasAside
                        ? 'notion-page-content-has-aside'
                        : '',
                      fullPageProperties().hasToc
                        ? 'notion-page-content-has-toc'
                        : '',
                    ]"
                  >
                    <article class="notion-page-content-inner">
                      <ng-container *ngTemplateOutlet="innerContent" />
                    </article>
                    @if (fullPageProperties().hasAside) {
                      <an-page-aside
                        [toc]="fullPageProperties().toc"
                        [activeSection]="activeSection()"
                        [setActiveSection]="activeSection.set"
                        [hasToc]="!!fullPageProperties().hasToc"
                        [hasAside]="!!fullPageProperties().hasAside"
                        [pageAside]="pageAside()"
                      />
                    }
                  </div>
                }

                <ng-container *ngComponentOutlet="pageFooter()" />
              </main>

              <ng-container *ngComponentOutlet="footer()" />
            </div>
          </div>
        </div>
      } @else {
        <main
          [ngClass]="[
            'notion-page',
            fullPageProperties().hasPageCover
              ? 'notion-page-has-cover'
              : 'notion-page-no-cover',
            blockFormat().page_icon
              ? 'notion-page-has-icon'
              : 'notion-page-no-icon',
            fullPageProperties().isPageIconUrl
              ? 'notion-page-has-image-icon'
              : 'notion-page-has-text-icon',
            'notion-full-page',
            blockFormat().page_full_width ? 'notion-full-width' : '',
            blockFormat().page_small_text ? 'notion-small-text' : '',
            bodyClassName(),
          ]"
        >
          <div class="notion-viewport"></div>

          <ng-container *ngComponentOutlet="pageHeader()" />

          @if (
            block().type === 'collection_view_page' ||
            (block().type === 'page' && block().parent_table === 'collection')
          ) {
            <ng-container
              *ngComponentOutlet="
                ctx.components()?.Collection ?? null;
                inputs: { block: block() }
              "
            />
          }
          @if (block().type !== 'collection_view_page') {
            <ng-container *ngTemplateOutlet="innerContent" />
          }
          <ng-container *ngComponentOutlet="pageFooter()" />
        </main>
      }
    } @else {
      <an-page-link
        [className]="
          [
            'notion-page-link',
            blockColor() && 'notion-' + blockColor(),
            blockId(),
          ].join(' ')
        "
        [href]="ctx.mapPageUrl()(block().id)"
        [component]="ctx.components().PageLink ?? null"
      >
        <an-page-title [block]="block()" />
      </an-page-link>
    }

    <ng-template #innerContent>
      <ng-content />
    </ng-template>

    <ng-template #innerPageLink>
      <an-page-title [block]="block()" />
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnViewPageBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly header = input.required<AngularComponent>();
  readonly level = input.required<number>();
  readonly pageCover = input.required<AngularComponent | undefined>();
  readonly pageHeader = input.required<AngularComponent>();
  readonly pageTitle = input.required<AngularComponent>();
  readonly pageAside = input.required<AngularComponent>();
  readonly pageFooter = input.required<AngularComponent>();
  readonly footer = input.required<AngularComponent>();
  readonly bodyClassName = input<string>('');
  readonly disableHeader = input.required<boolean>();
  readonly className = input<string>('');
  readonly blockId = input<string | undefined>(undefined);

  readonly activeSection = signal<string | null>(null);
  readonly blockColor = computed(() => this.block().format?.block_color);
  readonly blockFormat = computed<{
    page_icon: string | undefined;
    page_cover: string | undefined;
    page_cover_position: string | undefined;
    page_full_width: string | undefined;
    page_small_text: string | undefined;
  }>(() => {
    const {
      page_icon = this.ctx.defaultPageIcon(),
      page_cover = this.ctx.defaultPageCover(),
      page_cover_position = this.ctx.defaultPageCoverPosition(),
      page_full_width,
      page_small_text,
    } = this.block().format || {};
    return {
      page_icon,
      page_cover,
      page_cover_position,
      page_full_width,
      page_small_text,
    };
  });
  readonly fullPageProperties = computed(() => {
    const block = this.block();
    const recordMap = this.ctx.recordMap();
    if (block && recordMap) {
      const blockCollectionId = getBlockCollectionId(
        block,
        recordMap,
      ) as string;
      const properties =
        block.type === 'page'
          ? block.properties
          : {
              title: recordMap.collection[blockCollectionId]?.value?.name,
            };

      const pageCoverPosition: number = !!this.blockFormat().page_cover_position
        ? Number(this.blockFormat().page_cover_position)
        : 0.5;
      const coverPosition = (1 - pageCoverPosition) * 100;
      const pageCoverObjectPosition = `center ${coverPosition}%`;
      let pageCoverStyle =
        this.ctx.pageCoverStyleCache[pageCoverObjectPosition];
      if (!pageCoverStyle) {
        pageCoverStyle = this.ctx.pageCoverStyleCache[pageCoverObjectPosition] =
          {
            objectPosition: pageCoverObjectPosition,
          };
      }

      const pageIcon =
        getBlockIcon(block, recordMap) ?? this.ctx.defaultPageIcon();
      const isPageIconUrl = pageIcon && isUrl(pageIcon);

      const toc = getPageTableOfContents(block as types.PageBlock, recordMap);

      const hasToc =
        this.ctx.showTableOfContents() &&
        toc.length >= (this.ctx.minTableOfContentsItems() ?? 0);
      const hasAside =
        (hasToc || this.pageAside()) && !this.blockFormat().page_full_width;
      const hasPageCover = this.pageCover() || this.blockFormat().page_cover;

      return {
        property: properties,
        hasToc,
        toc,
        hasAside,
        hasPageCover,
        pageCoverStyle,
        isPageIconUrl,
      };
    } else {
      return {
        property: { title: undefined },
        hasAside: undefined,
        hasPageCover: undefined,
        isPageIconUrl: false,
        toc: [],
        hasToc: false,
        pageCoverStyle: {},
      };
    }
  });
  protected readonly getTextContent = getTextContent;
}
