import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Block } from 'notion-types';
import { NotionContextService } from '../context.service';
import { NgClass } from '@angular/common';
import { AnLinkComponent } from '../components/link/link.component';
import { AnGracefulImageComponent } from '../components/graceful-image.component';
import TimeAgo from 'javascript-time-ago';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'an-google-drive-block',
  standalone: true,
  imports: [NgClass, AnLinkComponent, AnGracefulImageComponent],
  template: `
    @if (params()) {
      <div [ngClass]="['notion-google-drive', className()].join(' ')">
        <an-link
          [component]="ctx.components().Link ?? null"
          className="notion-google-drive-link"
          [href]="params()!.properties.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="notion-google-drive-preview">
            <an-graceful-image
              [src]="
                ctx.mapImageUrl()(params()!.properties.thumbnail, block()) ??
                undefined
              "
              [alt]="params()!.properties.title || 'Google Drive Document'"
              loading="lazy"
            />
          </div>

          <div class="notion-google-drive-body">
            @if (params()!.properties.title) {
              <div class="notion-google-drive-body-title">
                {{ params()!.properties.title }}
              </div>
            }

            @if (params()!.properties.modified_time) {
              <div class="notion-google-drive-body-modified-time">
                Last modified
                {{
                  params()!.properties.user_name
                    ? 'by ' + params()!.properties.user_name
                    : ''
                }}
                {{ getTimeAgo(params()!.properties.modified_time) }}
              </div>
            }

            @if (params()!.properties.icon && params()!.url) {
              <div class="notion-google-drive-body-source">
                @if (params()!.properties.icon) {
                  <div
                    class="notion-google-drive-body-source-icon"
                    [style.background-image]="
                      'url(' + params()!.properties.icon + ')'
                    "
                  ></div>
                }
                @if (params()!.url?.hostname) {
                  <div class="notion-google-drive-body-source-domain">
                    {{ params()!.url!.hostname }}
                  </div>
                }
              </div>
            }
          </div>
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
export class AnGoogleDriveBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly className = input<string>('');
  timeAgo: TimeAgo;
  private sanitize = inject(DomSanitizer);
  readonly params = computed<null | {
    url: URL | null;
    sanitizedUrl: SafeResourceUrl | null;
    properties: any;
  }>(() => {
    const properties = this.block().format?.drive_properties;
    if (!properties) return null;
    try {
      const value = new URL(properties.url);
      return {
        url: value,
        sanitizedUrl: this.sanitize.bypassSecurityTrustUrl(value.hostname),
        properties,
      };
    } catch (err) {
      return {
        properties,
        url: null,
        sanitizedUrl: null,
      };
    }
  });

  constructor() {
    this.timeAgo = new TimeAgo('en-US');
  }

  getTimeAgo(date: string): string {
    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(new Date(date));
  }
}
