import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { AngularComponent } from '../type';
import { getTextContent, uuidToId } from 'notion-utils';
import {
  NgClass,
  NgComponentOutlet,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common';
import { AnLazyImageComponent } from '../components/lazy-image.component';
import { AnPageAsideComponent } from '../components/page-aside.component';
import { AnPageIconComponent } from '../components/page-icon.component';
import { AnTextComponent } from '../components/text.component';
import { AnPageTitleComponent } from '../components/page-title.component';
import { AnHeaderComponent } from '../components/header.component';
import { AnViewPageComponent } from '../components/view-page.component';
import { AnListComponent } from '../components/list.component';

export interface BlockProps {
  block: Block;
  level: number;
  className?: string;
  bodyClassName?: string;
  header?: AngularComponent;
  footer?: AngularComponent;
  pageHeader?: AngularComponent;
  pageFooter?: AngularComponent;
  pageTitle?: AngularComponent;
  pageAside?: AngularComponent;
  pageCover?: AngularComponent;
  hideBlockId?: boolean;
  disableHeader?: boolean;
  children?: AngularComponent;
}

@Component({
  selector: 'an-block',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    AnLazyImageComponent,
    NgComponentOutlet,
    AnPageAsideComponent,
    AnPageIconComponent,
    AnTextComponent,
    AnPageTitleComponent,
    AnHeaderComponent,
    AnViewPageComponent,
    AnListComponent,
  ],
  template: `
    @if (this.block()) {
      @if (
        this.block().type === 'collection_view_page' ||
        this.block().type === 'page'
      ) {
        <an-view-page
          [block]="block()"
          [bodyClassName]="bodyClassName()"
          [disableHeader]="disableHeader()"
          [className]="className()"
          [footer]="footer()"
          [header]="header()"
          [level]="level()"
          [pageAside]="pageAside()"
          [pageCover]="pageCover()"
          [pageFooter]="pageFooter()"
          [pageHeader]="pageHeader()"
          [pageTitle]="pageTitle()"
        />
      } @else if (
        this.block().type === 'header' ||
        this.block().type === 'sub_header' ||
        this.block().type === 'sub_sub_header'
      ) {
        <an-header [block]="block()" [blockId]="blockId()" />
      } @else if (this.block().type === 'divider') {
        <hr [ngClass]="['notion-hr', blockId() ?? '']" />
      } @else if (this.block().type === 'text') {
        @if (!block().properties && !block().content?.length) {
          <div [ngClass]="['notion-blank', blockId() ?? '']">&nbsp;</div>
        } @else {
          <div
            [ngClass]="[
              'notion-text',
              blockColor() ? 'notion-' + blockColor() : '',
              blockId() ?? '',
            ]"
          >
            @if (block().properties?.title) {
              <an-text [value]="block().properties.title" [block]="block()" />
            }
            <div class="notion-text-children">
              <ng-content />
            </div>
          </div>
        }
      } @else if (
        this.block().type === 'bulleted_list' ||
        this.block().type === 'numbered_list'
      ) {
        <an-list [block]="block()" [blockId]="blockId()">
          <ng-content />
        </an-list>
      } @else if (this.block().type === 'embed') {
        <!--        <embed [blockId]="blockId()" [block]="block"/>-->
      } @else if (
        [
          'replit',
          'tweet',
          'maps',
          'pdf',
          'figma',
          'typeform',
          'codepen',
          'excalidraw',
          'image',
          'gist',
          'video',
        ].includes(this.block().type)
      ) {
        <!--        <asset-wrapper [blockId]="blockId()" [block]="block()"/>-->
      } @else if (this.block().type === 'drive') {
        @if (!block().format?.drive_properties) {
          @if (block().format?.display_source) {
            <!--            <asset-wrapper [blockId]="blockId()" [block]="block()"/>-->
          }
        } @else {
          <!--          <google-drive-->
          <!--            [block]="block() as GoogleDriveBlock"-->
          <!--            [ngClass]="[blockId()]" -->
          <!--          />-->
        }
      } @else if (this.block().type === 'audio') {
        <!--        <Audio [block]="block() as AudioBlock" [ngClass]="[blockId()]"/>-->
      } @else if (this.block().type === 'file') {
        <!--        <file [block]="block() as FileBlock" [ngClass]="[blockId()]"/>-->
      } @else if (this.block().type === 'equation') {
        <!--        <components.Equation-->
        <!--          [block]="block() as EquationBlock"-->
        <!--          [inline]="false"-->
        <!--          [ngClass]="[blockId()]"-->
        <!--        />-->
      } @else if (this.block().type === 'code') {
        <!--        <components.Code [block]="block() as CodeBlock"/>-->
      } @else if (this.block().type === 'column_list') {
        <div [ngClass]="['notion-row', blockId() ?? '']">
          <ng-content />
        </div>
      } @else if (this.block().type === 'column') {
        <div [ngClass]="['notion-column', blockId() ?? '']">
          [ngStyle]="style()">
          <ng-content />
        </div>

        <div class="notion-spacer"></div>
      } @else if (this.block().type === 'quote') {
        @if (block().properties) {
          <!--          <blockquote-->
          <!--            [ngClass]="[-->
          <!--                 'notion-quote',-->
          <!--            block().format?.block_color() && 'notion-'+block().format?.block_color(),-->
          <!--            blockId()-->
          <!--            ]"-->
          <!--       -->
          <!--          >-->
          <!--            <div>-->
          <!--              &lt;!&ndash;          <text [value]="block().properties.title" [block]="block()"/>&ndash;&gt;-->
          <!--            </div>-->
          <!--            <ng-content/>-->
          <!--          </blockquote>-->
        }
      } @else if (this.block().type === 'collection_view') {
        <!--        <components.Collection [block]="block()" [ngClass]="[blockId()]" [ctx]="ctx()"/>-->
      } @else if (this.block().type === 'callout') {
        @if (ctx.components()?.Callout) {
          <!--        <components.Callout [block]="block()" [ngClass]="[blockId()]"/>-->
        } @else {
          <div
            [ngClass]="[
              'notion-callout',
              block().format?.block_color
                ? 'notion-' + block().format?.block_color
                : '',
              blockId() ?? '',
            ]"
          >
            <!--            <page-icon [block]="block()"/>-->

            <div class="notion-callout-text">
              <!--              <text [value]="block().properties?.title" [block]="block()"/>-->
              <ng-content />
            </div>
          </div>
        }
      } @else if (this.block().type === 'bookmark') {
        @if (block().properties) {
          <div class="notion-row">
            <!--            <link-->
            <!--              target='_blank'-->
            <!--              rel='noopener noreferrer'-->
            <!--              [ngClass]="['notion-bookmark',-->
            <!--            block().format?.block_color && 'notion-'+block().format.block_color,-->
            <!--            blockId()]"-->
            <!--        [href]="link()[0][0]"-->
            <!--          >-->
            <div>
              <!--              @if (title()) {-->
              <!--                <div class='notion-bookmark-title'>-->
              <!--                  &lt;!&ndash;              <text [value]="[[title()]]" [block]="block()"/>&ndash;&gt;-->
              <!--                </div>-->
              <!--              }-->
              @if (block().properties?.description) {
                <div class="notion-bookmark-description">
                  <!--        <text [value]="block().properties?.description" [block]="block()"/>-->
                </div>
              }

              <!--              <div class='notion-bookmark-link'>-->
              <!--                @if (block().format?.bookmark_icon) {-->
              <!--                  <div class='notion-bookmark-link-icon'>-->
              <!--                    <an-lazy-image-->
              <!--                      [src]="ctx.mapImageUrl()(block().format?.bookmark_icon, block)"-->
              <!--                      [alt]="title()"-->
              <!--                    />-->
              <!--                  </div>-->
              <!--                }-->

              <!--                <div class='notion-bookmark-link-text'>-->
              <!--                  &lt;!&ndash;                  <text [value]="link()" [block]="block()"/>&ndash;&gt;-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
            @if (block().format?.bookmark_cover) {
              <div class="notion-bookmark-image">
                <an-lazy-image
                  [src]="
                    ctx.mapImageUrl()(block().format?.bookmark_cover, block())
                  "
                  [alt]="getTextContent(block().properties?.title)"
                  [style.object-fit]="'cover'"
                />
              </div>
            }
            <!--        </Link>-->
          </div>
        }
      } @else if (this.block().type === 'toggle') {
        <details [ngClass]="['notion-toggle', blockId() ?? '']">
          <summary>
            <an-text [value]="block().properties?.title" [block]="block()" />
          </summary>
          <div>
            <ng-content />
          </div>
        </details>
      } @else if (this.block().type === 'table_of_contents') {
        <!--        @if (page()) {-->
        <!--          <div-->
        <!--            [ngClass]="[-->
        <!--            'notion-table-of-contents',-->
        <!--            blockColor() && 'notion-'+blockColor(),-->
        <!--            blockId()-->
        <!--            ]"-->

        <!--          >-->
        <!--            @for (tocItem of toc(); track tocItem.id) {-->
        <!--              <a-->
        <!--                [href]="'#'+uuidToId(tocItem.id)"-->
        <!--                class='notion-table-of-contents-item'-->
        <!--              >-->
        <!--          <span-->
        <!--            class='notion-table-of-contents-item-body'-->
        <!--            [style.display]="'inline-block'"-->
        <!--            [style.marginLeft.px]="tocItem.indentLevel * 24"-->
        <!--          >-->
        <!--        {{ tocItem.text }}-->
        <!--        </span>-->
        <!--              </a>-->
        <!--            }-->
        <!--          </div>-->
        <!--        }-->
      } @else if (this.block().type === 'to_do') {
        <div [ngClass]="['notion-to-do', blockId() ?? '']">
          <div class="notion-to-do-item">
            <!--            <checkbox [blockId]="blockId()" [isChecked]="block().properties?.checked?.[0]?.[0] === 'Yes'"/>-->
            <div
              [ngClass]="[
                'notion-to-do-body',
                block().properties?.checked?.[0]?.[0] === 'Yes'
                  ? 'notion-to-do-checked'
                  : '',
              ]"
            >
              <!--              <Text [value]="block().properties?.title" [block]="block()"/>-->
            </div>
          </div>
          <div class="notion-to-do-children">
            <ng-content />
          </div>
        </div>
      } @else if (this.block().type === 'transclusion_container') {
        <div [ngClass]="['notion-sync-block', blockId() ?? '']">
          <ng-container />
        </div>
      } @else if (this.block().type === 'transclusion_reference') {
        <!--        <sync-pointer-block [block]="block" [level]="level() + 1" [props]="props"  />-->
      } @else if (this.block().type === 'alias') {
        @if (
          ctx.recordMap()!.block[block()?.format?.alias_pointer?.id]?.value
        ) {
          <!--          <page-link-->
          <!--            [ngClass]="['notion-page-link', block()?.format?.alias_pointer?.id]"-->
          <!--            [href]="mapPageUrl(block()?.format?.alias_pointer?.id)"-->
          <!--          >-->
          <!--            <page-title [block]="ctx.recordMap().block[block()?.format?.alias_pointer?.id]?.value"/>-->
          <!--          </page-link>-->
        }
      } @else if (this.block().type === 'table') {
        <table [ngClass]="['notion-simple-table', blockId() ?? '']">
          <tbody>
            <ng-content />
          </tbody>
        </table>
      } @else if (this.block().type === 'table_row') {
        <!--        @if (tableBlock() && tableBlock().format?.table_block_column_order) {-->
        <!--          <tr [ngClass]="[-->
        <!--           'notion-simple-table-row',-->
        <!--            backgroundColor() && 'notion-'+backgroundColor(),-->
        <!--            blockId()-->
        <!--          ]">-->
        <!--            @for (column of tableBlock().format?.table_block_column_order; track column) {-->
        <!--              <td-->
        <!--                [ngClass]="[tableBlock().format?.table_block_column_format?.[column]?.color ? 'notion-'+tableBlock().format?.table_block_column_format?.[column]?.color:'']"-->
        <!--                [style.width.px]="tableBlock().format?.table_block_column_format?.[column]?.width || 120"-->
        <!--              >-->
        <!--                <div class='notion-simple-table-cell'>-->
        <!--                  &lt;!&ndash;              <Text&ndash;&gt;-->
        <!--                  &lt;!&ndash;                [value]="block().properties?.[column] || [['ㅤ']]"&ndash;&gt;-->
        <!--                  &lt;!&ndash;        [block]="block()"&ndash;&gt;-->
        <!--                  &lt;!&ndash;          />&ndash;&gt;-->
        <!--                </div>-->
        <!--              </td>-->
        <!--            }-->
        <!--          </tr>-->
        <!--        }-->
      } @else if (this.block().type === 'external_object_instance') {
        <!--        <eoi [block]="block()" [ngClass]="[blockId()]"/>-->
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent implements OnInit {
  readonly block = input.required<Block>();
  readonly level = input.required<number>();
  readonly className = input<string>('');
  readonly bodyClassName = input<string>('');
  readonly header = input<AngularComponent>(null);
  readonly footer = input<AngularComponent>(null);
  readonly pageHeader = input<AngularComponent>(null);
  readonly pageFooter = input<AngularComponent>(null);
  readonly pageTitle = input<AngularComponent>(null);
  readonly pageAside = input<AngularComponent>(null);
  readonly pageCover = input<AngularComponent>(null);
  readonly hideBlockId = input<boolean | undefined>(undefined);
  readonly disableHeader = input<boolean>(false);

  readonly blockId = computed<string>(() => {
    return this.hideBlockId()
      ? 'notion-block'
      : `notion-block-${uuidToId(this.block().id)}`;
  });
  readonly blockColor = computed(() => this.block().format?.block_color);
  protected readonly getTextContent = getTextContent;
  private contextService = inject(NotionContextService);
  readonly ctx = this.contextService;

  ngOnInit() {
    if (this.level() === 0 && this.block().type === 'collection_view') {
      (this.block() as any).type = 'collection_view_page';
    }
  }
}
