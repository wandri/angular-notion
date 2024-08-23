import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { AnPageLinkComponent } from '../components/link/page-link.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AnTextComponent } from '../components/text/text';
import { parsePageId } from 'notion-utils';
import { AnAssetComponent } from '../components/asset.component';

@Component({
  selector: 'an-asset-wrapper-block',
  standalone: true,
  imports: [
    AnPageLinkComponent,
    NgClass,
    AnTextComponent,
    NgTemplateOutlet,
    AnAssetComponent,
  ],
  template: `
    @if (params()) {
      @if (params().isURL) {
        <an-page-link
          [component]="ctx.components().PageLink ?? null"
          [style]="urlStyle"
          [href]="
            params()!.isPage && params()!.id
              ? ctx.mapPageUrl()(params()!.id!)
              : params()!.caption
          "
          [target]="params()!.target"
        >
          <ng-container *ngTemplateOutlet="figure" />
        </an-page-link>
      } @else {
        <ng-container *ngTemplateOutlet="figure" />
      }

      <ng-template #figure>
        <figure
          [ngClass]="[
            'notion-asset-wrapper',
            'notion-asset-wrapper-' + block().type,
            block().format?.block_full_width ? 'notion-asset-wrapper-full' : '',
            blockId(),
          ]"
        >
          <an-asset
            [block]="block()"
            [zoomable]="ctx.zoom() && !params()!.isURL"
          >
            @if (block().properties?.caption && !params()!.isURL) {
              <figcaption class="notion-asset-caption">
                <an-text
                  [value]="block().properties.caption"
                  [block]="block()"
                />
              </figcaption>
            }
          </an-asset>
        </figure>
      </ng-template>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnAssetWrapperBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly blockId = input.required<string>();
  readonly urlStyle = { width: '100%' };

  readonly params = computed<{
    isURL: boolean;
    isPage?: boolean;
    id?: string;
    target: null | string;
    caption?: string;
  }>(() => {
    let isURL = false;
    let caption = undefined;
    let id = undefined;
    let isPage = false;
    let captionHostname = undefined;
    if (this.block().type === 'image') {
      const caption: string = this.block()?.properties?.caption?.[0]?.[0];
      if (caption) {
        id = parsePageId(caption, { uuid: true });

        isPage = caption.charAt(0) === '/' && !!id;
        if (isPage || isValidURL(caption)) {
          isURL = true;
        }
      }
    }

    if (isURL) {
      caption = this.block()?.properties?.caption[0][0];
      id = parsePageId(caption, { uuid: true });
      isPage = caption.charAt(0) === '/' && !!id;
      captionHostname = extractHostname(caption);
    }

    const target =
      captionHostname &&
      captionHostname !== this.ctx.rootDomain() &&
      !caption?.startsWith('/')
        ? 'blank_'
        : null;
    return {
      isURL,
      id,
      caption,
      isPage,
      captionHostname,
      target,
    };
  });
}

export function isValidURL(str: string) {
  // TODO: replace this with a more well-tested package
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  );
  return !!pattern.test(str);
}

export function extractHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch (err) {
    return '';
  }
}
