import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AngularComponent } from '../type';
import { NgComponentOutlet } from '@angular/common';

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

@Component({
  selector: 'an-mention-preview-card',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <div class="notion-external-subtitle">
      @if (externalImage()) {
        <div class="notion-preview-card-domain-warp">
          <div class="notion-preview-card-logo">
            <ng-container *ngComponentOutlet="externalImage() ?? null" />
          </div>
          <div class="notion-preview-card-domain">
            {{ capitalizeFirstLetter(domain().split('.')[0]) }}
          </div>
        </div>
      }
      <div class="notion-preview-card-title">{{ title() }}</div>
      @if (owner()) {
        <div class="notion-external-subtitle-item">
          <div class="notion-external-subtitle-item-name">Owner</div>
          <span class="notion-external-subtitle-item-desc">{{ owner() }}</span>
        </div>
      }
      @if (lastUpdated()) {
        <div class="notion-external-subtitle-item">
          <div class="notion-external-subtitle-item-name">Updated</div>
          <span class="notion-external-subtitle-item-desc">{{
            lastUpdated()
          }}</span>
        </div>
      }
      @if (domain() === 'github.com') {
        <div class="notion-preview-card-github-shields">
          <img
            [src]="
              'https://img.shields.io/github/stars/' +
              owner() +
              '/' +
              title() +
              'logo=github'
            "
            alt=""
          />
          <img
            [src]="
              'https://img.shields.io/github/last-commit/' +
              owner() +
              '/' +
              title()
            "
            alt=""
          />
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnMentionPreviewCardComponent {
  readonly owner = input<string | undefined>(undefined);
  readonly lastUpdated = input<string | undefined | null>(undefined);
  readonly title = input.required<string>();
  readonly domain = input.required<string>();
  readonly externalImage = input<AngularComponent>();

  readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
