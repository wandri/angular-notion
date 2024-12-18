import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block } from 'notion-types';
import { NotionContextService } from '../context.service';
import { getYoutubeId } from '../utils';
import { getTextContent } from 'notion-utils';
import { NgComponentOutlet, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AnLazyImageComponent } from './lazy-image.component';
import { AnYoutubeLiteEmbedComponent } from './youtube-lite-embed.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseContentBlock } from 'notion-types/build/block';

export const isServer = typeof window === 'undefined';

export const supportedAssetTypes = [
  'replit',
  'video',
  'image',
  'embed',
  'figma',
  'typeform',
  'excalidraw',
  'maps',
  'tweet',
  'pdf',
  'gist',
  'codepen',
  'drive',
];

type Style = Record<string, string | number> & {
  position?: string;
  display?: string;
  justifyContent?: string;
  alignSelf?: string;
  maxWidth?: string;
  flexDirection?: string;
  height?: string;
  background?: string;
  paddingBottom?: string;
  objectFit?: string;
  overflow?: string;
  width?: string;
  padding?: string;
  minHeight?: string;
};

@Component({
  selector: 'an-asset',
  imports: [
    NgStyle,
    NgTemplateOutlet,
    NgComponentOutlet,
    AnLazyImageComponent,
    AnYoutubeLiteEmbedComponent,
  ],
  template: `
    @if (params()) {
      <div [ngStyle]="params()!.style">
        @if (params()!.type === 'pdf') {
          @if (params()!.content.isServer) {
            <ng-container
              *ngComponentOutlet="
                ctx.components().Pdf ?? null;
                inputs: { file: params()!.content.source }
              "
            />
          }
        } @else if (params()!.type === 'gist') {
          <iframe
            [ngStyle]="params()!.assetStyle"
            class="notion-asset-object-fit"
            [src]="
              sanitize.bypassSecurityTrustResourceUrl(
                params()!.content.src ?? ''
              )
            "
            title="GitHub Gist"
            frameBorder="0"
            sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
            loading="lazy"
            scrolling="auto"
          ></iframe>
        } @else if (params()!.type === 'youtube') {
          <an-youTube-lite-embed
            [id]="params()!.content.youtubeVideoId"
            [ngStyle]="params()!.assetStyle"
            className="notion-asset-object-fit"
          />
        } @else if (params()!.type === 'tweet') {
          <div [ngStyle]="params()!.assetStyle">
            <ng-container
              *ngComponentOutlet="
                ctx.components().Tweet ?? null;
                inputs: { id: params()!.content.id }
              "
            />
          </div>
        } @else if (params()!.type === 'video') {
          <video
            playsInline
            controls
            preload="metadata"
            [ngStyle]="params()!.assetStyle"
            [src]="params()!.content.source"
            [title]="block().type"
          ></video>
        } @else if (params()!.type === 'embed') {
          <iframe
            [ngStyle]="params()!.assetStyle"
            class="notion-asset-object-fit"
            [src]="
              sanitize.bypassSecurityTrustResourceUrl(
                params()!.content.src ?? ''
              )
            "
            title="GitHub Gist"
            frameBorder="0"
            sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
            loading="lazy"
            scrolling="auto"
          ></iframe>
        }

        @if (block().type === 'image') {
          <an-lazy-image
            [src]="params()!.content.src"
            [alt]="params()!.content.alt"
            [height]="params()!.style.height"
            [ngStyle]="params()!.assetStyle"
          />
          <ng-container *ngTemplateOutlet="innerContent" />
        }
      </div>
      @if (block().type !== 'image') {
        <ng-container *ngTemplateOutlet="innerContent" />
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
export class AnAssetComponent {
  readonly sanitize = inject(DomSanitizer);
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly zoomable = input<boolean>(false);

  readonly params = computed<null | {
    type: string;
    content: {
      alt?: string;
      src?: string | null;
      youtubeVideoId?: string;
      isServer?: boolean;
      source?: string;
      id?: string;
    };
    style: Style;
    assetStyle: Record<string, string | number>;
  }>(() => {
    const block = this.block() as BaseContentBlock;
    if (!block || !supportedAssetTypes.includes(block.type)) {
      return null;
    }

    const style: Style = {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      maxWidth: '100%',
      flexDirection: 'column',
    };

    const assetStyle: {
      objectFit?: string;
      width?: string;
      maxWidth?: number;
      marginLeft?: string;
      marginRight?: string;
    } = {};

    if (block.format) {
      const {
        block_aspect_ratio,
        block_height,
        block_width,
        block_full_width,
        block_page_width,
        block_preserve_scale,
      } = block.format;

      if (block_full_width || block_page_width) {
        if (block_full_width) {
          style.width = '100vw';
        } else {
          style.width = '100%';
        }

        if (block.type === 'video') {
          if (block_height) {
            style.height = `${block_height}px`;
          } else if (block_aspect_ratio) {
            style.paddingBottom = `${block_aspect_ratio * 100}%`;
          } else if (block_preserve_scale) {
            style.objectFit = 'contain';
          }
        } else if (block_aspect_ratio && block.type !== 'image') {
          style.paddingBottom = `${block_aspect_ratio * 100}%`;
        } else if (block_height) {
          style.height = `${block_height}px`;
        } else if (block_preserve_scale) {
          if (block.type === 'image') {
            style.height = '100%';
          } else {
            // TODO: this is just a guess
            style.paddingBottom = '75%';
            style.minHeight = '100px';
          }
        }
      } else {
        switch (block.format?.block_alignment) {
          case 'center': {
            style.alignSelf = 'center';
            break;
          }
          case 'left': {
            style.alignSelf = 'start';
            break;
          }
          case 'right': {
            style.alignSelf = 'end';
            break;
          }
        }

        if (block_width) {
          style.width = `${block_width}px`;
        }

        if (block_preserve_scale && block.type !== 'image') {
          style.paddingBottom = '50%';
          style.minHeight = '100px';
        } else {
          if (block_height && block.type !== 'image') {
            style.height = `${block_height}px`;
          }
        }
      }

      if (block.type === 'image') {
        assetStyle.objectFit = 'cover';
      } else if (block_preserve_scale) {
        assetStyle.objectFit = 'contain';
      }
    }

    let source =
      this.ctx.recordMap().signed_urls?.[block.id] ||
      block.properties?.source?.[0]?.[0];

    if (!source) {
      return null;
    }

    if (block.type === 'tweet') {
      const src = source;
      if (!src) return null;

      const id = src.split('?')[0].split('/').pop();
      if (!id) return null;

      return {
        type: 'tweet',
        content: {
          id: id,
        },
        style: style,
        assetStyle: {
          ...assetStyle,
          maxWidth: '420px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      };
    } else if (block.type === 'pdf') {
      return {
        type: 'pdf',
        content: {
          isServer: isServer,
          source: source,
        },
        style: {
          ...style,
          overflow: 'auto',
          background: 'rgb(226, 226, 226)',
          display: 'block',
        },
        assetStyle: assetStyle,
      };
    } else if (
      block.type === 'embed' ||
      block.type === 'video' ||
      block.type === 'figma' ||
      block.type === 'gist' ||
      block.type === 'maps' ||
      block.type === 'excalidraw' ||
      block.type === 'codepen' ||
      block.type === 'drive'
    ) {
      if (
        block.type === 'video' &&
        source &&
        source.indexOf('youtube') < 0 &&
        source.indexOf('youtu.be') < 0 &&
        source.indexOf('vimeo') < 0 &&
        source.indexOf('wistia') < 0 &&
        source.indexOf('loom') < 0 &&
        source.indexOf('videoask') < 0 &&
        source.indexOf('getcloudapp') < 0
      ) {
        style.paddingBottom = undefined;

        return {
          type: 'video',
          style: {
            ...style,
          },
          content: {
            source,
          },
          assetStyle: assetStyle,
        };
      } else {
        let src = block.format?.display_source || source;

        if (src) {
          const youtubeVideoId: string | null =
            block.type === 'video' ? getYoutubeId(src) : null;
          if (youtubeVideoId) {
            return {
              type: 'youtube',
              content: {
                youtubeVideoId: youtubeVideoId,
              },
              style: style,
              assetStyle: assetStyle,
            };
          } else if (block.type === 'gist') {
            if (!src.endsWith('.pibb')) {
              src = `${src}.pibb`;
            }

            assetStyle.width = '100%';
            style.paddingBottom = '50%';
            return {
              type: 'gist',
              content: {
                src: src,
              },
              style: style,
              assetStyle: assetStyle,
            };
          } else {
            return {
              type: 'embed',
              content: {
                src: src,
              },
              style: style,
              assetStyle: assetStyle,
            };
          }
        }
      }
    } else if (block.type === 'image') {
      if (source.includes('file.notion.so')) {
        source = block.properties?.source?.[0]?.[0];
      }
      const src = this.ctx.mapImageUrl()(source, block as Block);
      const caption = getTextContent(block.properties?.caption);
      const alt = caption || 'notion image';

      return {
        type: 'image',
        content: {
          src: src,
          alt: alt,
        },
        style: style,
        assetStyle: assetStyle,
      };
    }

    return {
      type: 'unset',
      content: {},
      style: style,
      assetStyle: assetStyle,
    };
  });
}
