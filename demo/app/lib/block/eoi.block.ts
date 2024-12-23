import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NotionContextService } from '../context.service';
import { Block } from 'notion-types';
import { NgComponentOutlet } from '@angular/common';
import { formatNotionDateTime } from '../utils';
import { AnGithubIconComponent } from '../icons/svg-type-github';
import { AngularComponent } from '../type';
import { AnMentionPreviewCardComponent } from '../components/mention-preview-card.component';
import { AnLinkComponent } from '../components/link/link.component';

@Component({
  selector: 'an-eoi-block',
  imports: [NgComponentOutlet, AnMentionPreviewCardComponent, AnLinkComponent],
  template: `
    @if (params()) {
      <an-link
        [component]="ctx.components().Link ?? null"
        [className]="
          [
            'notion-external',
            this.inline()
              ? 'notion-external-mention'
              : 'notion-external-block notion-row',
            className(),
          ].join(' ')
        "
        [href]="params()!.original_url"
        rel="noopener noreferrer"
        target="_blank"
      >
        @if (params()!.isExternalImage) {
          <div class="notion-external-image">
            <ng-container [ngComponentOutlet]="params()!.isExternalImage" />
          </div>
        }
        <div class="notion-external-description">
          <div class="notion-external-title">{{ params()!.title }}</div>
          @if (params()!.owner || params()!.lastUpdated) {
            <an-mention-preview-card
              [title]="params()!.title"
              [owner]="params()!.owner"
              [lastUpdated]="params()!.lastUpdated"
              [domain]="params()!.domain"
              [externalImage]="params()!.isExternalImage"
            />
          }
        </div>
      </an-link>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnEoiBlockComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly inline = input<boolean | undefined>(undefined);
  readonly className = input<string>('');

  readonly params = computed(() => {
    const { original_url, attributes, domain } = this.block()?.format || {};
    if (!original_url || !attributes) {
      return null;
    }

    const title = attributes.find((attr: any) => attr.id === 'title')
      ?.values[0];
    let owner = attributes.find((attr: any) => attr.id === 'owner')?.values[0];
    const lastUpdatedAt = attributes.find(
      (attr: any) => attr.id === 'updated_at',
    )?.values[0];
    const lastUpdated = lastUpdatedAt
      ? formatNotionDateTime(lastUpdatedAt)
      : null;
    let externalImage: AngularComponent;

    switch (domain) {
      case 'github.com':
        externalImage = AnGithubIconComponent;
        if (owner) {
          const parts = owner.split('/');
          owner = parts[parts.length - 1];
        }
        return {
          isExternalImage: externalImage,
          title,
          owner,
          lastUpdated,
          domain,
          original_url,
        };

      default:
        return null;
    }
  });
}
