import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { NotionContextService } from './context.service';
import { Block } from 'notion-types';
import { AngularComponent } from './type';
import { uuidToId } from 'notion-utils';
import {
  NgClass,
  NgComponentOutlet,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common';
import { AnLazyImageComponent } from './components/lazy-image.component';
import { AnPageAsideComponent } from './components/page-aside.component';
import { AnPageIconComponent } from './components/page-icon.component';
import { AnTextComponent } from './components/text/text';
import { AnPageTitleComponent } from './components/page-title.component';
import { AnHeaderBlockComponent } from './block/header.block';
import { AnViewPageBlockComponent } from './block/view-page.block';
import { AnListBlockComponent } from './block/list.block';
import { AnCheckboxComponent } from './components/checkbox.component';
import { AnEoiBlockComponent } from './block/eoi.block';
import { AnColumnBlockComponent } from './block/column.block';
import { AnBookmarkBLockComponent } from './block/bookmark.block';
import { AnCalloutBlockComponent } from './block/callout.block';
import { AnTextBlockComponent } from './block/text.block';
import { AnAssetWrapperBlockComponent } from './block/asset-wrapper.block';
import { AnPageLinkComponent } from './components/link/page-link.component';
import { AnTodoBlockComponent } from './block/todo.block';
import { AnAliasBlockComponent } from './block/alias.block';
import { AnContentTableBlockComponent } from './block/content-table.block';
import { AnFileBlockComponent } from './block/file.block';
import { AnAudioBlockComponent } from './block/audio.block';
import { AnSyncPointerBlockComponent } from './block/sync-pointer.block';
import { AnTableRowBlockComponent } from './block/table-row.block';
import { AnGoogleDriveBlockComponent } from './block/google-drive.block';

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
    AnHeaderBlockComponent,
    AnViewPageBlockComponent,
    AnListBlockComponent,
    AnCheckboxComponent,
    AnEoiBlockComponent,
    AnColumnBlockComponent,
    AnBookmarkBLockComponent,
    AnCalloutBlockComponent,
    AnTextBlockComponent,
    AnAssetWrapperBlockComponent,
    AnPageLinkComponent,
    AnTodoBlockComponent,
    AnAliasBlockComponent,
    AnContentTableBlockComponent,
    AnFileBlockComponent,
    AnAudioBlockComponent,
    forwardRef(() => AnSyncPointerBlockComponent),
    AnTableRowBlockComponent,
    AnGoogleDriveBlockComponent,
  ],
  template: `
    @if (this.block()) {
      @if (
        this.block().type === 'collection_view_page' ||
        this.block().type === 'page'
      ) {
        <an-view-page-block
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
        >
          <ng-container *ngTemplateOutlet="innerContent" />
        </an-view-page-block>
      } @else if (
        this.block().type === 'header' ||
        this.block().type === 'sub_header' ||
        this.block().type === 'sub_sub_header'
      ) {
        <an-header-block [block]="block()" [blockId]="blockId()" />
      } @else if (this.block().type === 'divider') {
        <hr [ngClass]="['notion-hr', blockId()]" />
      } @else if (this.block().type === 'text') {
        <an-text-block [block]="block()" [blockId]="blockId()">
          <ng-container *ngTemplateOutlet="innerContent" />
        </an-text-block>
      } @else if (
        this.block().type === 'bulleted_list' ||
        this.block().type === 'numbered_list'
      ) {
        <an-list-block [block]="block()" [blockId]="blockId()">
          <ng-container *ngTemplateOutlet="innerContent" />
        </an-list-block>
      } @else if (this.block().type === 'embed') {
        <ng-container
          *ngComponentOutlet="
            ctx.components().Embed ?? null;
            inputs: { blockId: blockId(), block: block() }
          "
        />
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
        <an-asset-wrapper-block [blockId]="blockId()" [block]="block()" />
      } @else if (this.block().type === 'drive') {
        @if (!block().format?.drive_properties) {
          @if (block().format?.display_source) {
            <an-asset-wrapper-block [blockId]="blockId()" [block]="block()" />
          }
        } @else {
          <an-google-drive-block [block]="block()" [ngClass]="[blockId()]" />
        }
      } @else if (this.block().type === 'audio') {
        <an-audio-block [block]="block()" [ngClass]="[blockId()]" />
      } @else if (this.block().type === 'file') {
        <an-file-block [block]="block()" [ngClass]="[blockId()]" />
      } @else if (this.block().type === 'equation') {
        <ng-container
          *ngComponentOutlet="
            ctx.components().Equation ?? null;
            inputs: { block: block(), inline: false, className: [blockId()] }
          "
        />
      } @else if (this.block().type === 'code') {
        <ng-container *ngComponentOutlet="ctx.components().Code ?? null" />
      } @else if (this.block().type === 'column_list') {
        <div [ngClass]="['notion-row', blockId()]">
          <ng-container *ngTemplateOutlet="innerContent" />
        </div>
      } @else if (this.block().type === 'column') {
        <an-column-block [blockId]="blockId()" [block]="block()">
          <ng-container *ngTemplateOutlet="innerContent" />
        </an-column-block>
      } @else if (this.block().type === 'quote') {
        @if (block().properties) {
          <blockquote
            [ngClass]="
              [
                'notion-quote',
                block().format?.block_color
                  ? 'notion-' + block().format?.block_color
                  : '',
                blockId(),
              ].join(' ')
            "
          >
            <div>
              <an-text [value]="block().properties.title" [block]="block()" />
            </div>
            <ng-content />
          </blockquote>
        }
      } @else if (this.block().type === 'collection_view') {
        <ng-container
          *ngComponentOutlet="
            ctx.components()?.Collection ?? null;
            inputs: { block: block(), className: blockId() }
          "
        />
      } @else if (this.block().type === 'callout') {
        <an-callout-block [blockId]="blockId()" [block]="block()">
          <ng-container *ngTemplateOutlet="innerContent" />
        </an-callout-block>
      } @else if (this.block().type === 'bookmark') {
        <an-bookmark-block [block]="block()" [blockId]="blockId()" />
      } @else if (this.block().type === 'toggle') {
        <details [ngClass]="['notion-toggle', blockId()]">
          <summary>
            <an-text [value]="block().properties?.title" [block]="block()" />
          </summary>
          <div>
            <ng-container *ngTemplateOutlet="innerContent" />
          </div>
        </details>
      } @else if (this.block().type === 'table_of_contents') {
        <an-content-table-block [block]="block()" [blockId]="blockId()" />
      } @else if (this.block().type === 'to_do') {
        <an-todo-block [block]="block()" [blockId]="blockId()">
          <ng-container *ngTemplateOutlet="innerContent" />
        </an-todo-block>
      } @else if (this.block().type === 'transclusion_container') {
        <div [ngClass]="['notion-sync-block', blockId()]"></div>
      } @else if (this.block().type === 'transclusion_reference') {
        <an-sync-pointer-block [block]="block()" [level]="level() + 1" />
      } @else if (this.block().type === 'alias') {
        <an-alias-block [block]="block()" />
      } @else if (this.block().type === 'table') {
        <table [ngClass]="['notion-simple-table', blockId()]">
          <tbody>
            <ng-container *ngTemplateOutlet="innerContent" />
          </tbody>
        </table>
      } @else if (this.block().type === 'table_row') {
        <an-table-row-block
          [blockId]="blockId()"
          [block]="block()"
        ></an-table-row-block>
      } @else if (this.block().type === 'external_object_instance') {
        <an-eoi-block [block]="block()" [className]="blockId()" />
      }
    }

    <ng-template #innerContent>
      <ng-content />
    </ng-template>
  `,
  styles: `
    :host {
      display: contents;
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
  private contextService = inject(NotionContextService);
  readonly ctx = this.contextService;

  ngOnInit() {
    if (this.level() === 0 && this.block().type === 'collection_view') {
      (this.block() as any).type = 'collection_view_page';
    }
  }
}
