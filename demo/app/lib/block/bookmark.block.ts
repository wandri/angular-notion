import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block, Decoration } from 'notion-types';
import { AnLinkComponent } from '../components/link/link.component';
import { NgClass } from '@angular/common';
import { AnTextComponent } from '../components/text/text';
import { AnLazyImageComponent } from '../components/lazy-image.component';
import { getTextContent } from 'notion-utils';

@Component({
  selector: 'an-bookmark-block',
  standalone: true,
  imports: [AnLinkComponent, NgClass, AnTextComponent, AnLazyImageComponent],
  template: `
    @if (params()) {
      <div class="notion-row">
        <an-link
          target="_blank"
          rel="noopener noreferrer"
          [ngClass]="
            [
              'notion-bookmark',
              block().format?.block_color
                ? 'notion-' + block().format.block_color
                : '',
              blockId(),
            ].join(' ')
          "
          [href]="params()!.link[0][0]"
        >
          <div>
            @if (params()!.title) {
              <div class="notion-bookmark-title">
                <an-text [value]="[[params()!.title]]" [block]="block()" />
              </div>
            }
            @if (block().properties?.description) {
              <div class="notion-bookmark-description">
                <an-text
                  [value]="block().properties?.description"
                  [block]="block()"
                />
              </div>
            }

            <div class="notion-bookmark-link">
              @if (block().format?.bookmark_icon) {
                <div class="notion-bookmark-link-icon">
                  <an-lazy-image
                    [src]="
                      ctx.mapImageUrl()(block().format?.bookmark_icon, block())
                    "
                    [alt]="params()!.title"
                  />
                </div>
              }

              <div class="notion-bookmark-link-text">
                <an-text [value]="params()!.link" [block]="block()" />
              </div>
            </div>
          </div>

          @if (block().format?.bookmark_cover) {
            <div class="notion-bookmark-image">
              <an-lazy-image
                [src]="
                  ctx.mapImageUrl()(block().format?.bookmark_cover, block())
                "
                [alt]="getTextContent(block().properties?.title)"
                [style]="{ 'object-fit': 'cover' }"
              />
            </div>
          }
        </an-link>
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnBookmarkBLockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();
  readonly params = computed<null | { title: string; link: Decoration[] }>(
    () => {
      const link = this.block().properties.link;
      if (!link || !link[0]?.[0]) return null;

      let title = getTextContent(this.block().properties.title);
      if (!title) {
        title = getTextContent(link);
      }

      if (title) {
        if (title.startsWith('http')) {
          try {
            const url = new URL(title);
            title = url.hostname;
          } catch (err) {
            // ignore invalid links
          }
        }
      }
      return { title, link };
    },
  );
  protected readonly getTextContent = getTextContent;
}
