import { Component, computed, inject, input } from '@angular/core';
import { AnPageTitleComponent } from '../page-title.component';
import { AnGracefulImageComponent } from '../graceful-image.component';
import { NotionContextService } from '../../context.service';
import { Block, User } from 'notion-types';
import { ExternalLinkFormat, SubDecoration } from 'notion-types/build/core';
import { AnPageLinkComponent } from '../link/page-link.component';

@Component({
  selector: 'an-text-external-link',
  template: `
    @if (params().linkType === 'u') {
      @if (userInfo()) {
        <an-graceful-image
          className="notion-user"
          [src]="
            ctx.mapImageUrl()(userInfo()!.user.profile_photo, block()) ?? ''
          "
          [alt]="userInfo()!.name"
        />
      }
    } @else {
      <an-page-link
        [component]="ctx.components().PageLink"
        [className]="'notion-link'"
        [href]="ctx.mapPageUrl()(params().id)"
        target="_blank"
        rel="noopener noreferrer"
      >
        @if (defaultInfo()) {
          <an-page-title [block]="defaultInfo()!" />
        }
      </an-page-link>
    }
  `,
  imports: [
    AnPageTitleComponent,
    AnGracefulImageComponent,
    AnPageLinkComponent,
  ],
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class AnTextExternalLinkComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly decorator = input.required<SubDecoration>();
  readonly linkProps = input.required<any>();

  readonly params = computed<{ linkType: string; id: string }>(() => {
    const decorator = this.decorator() as ExternalLinkFormat;
    return {
      linkType: decorator[1][0],
      id: decorator[1][1],
    };
  });

  readonly defaultInfo = computed<null | Block>(() => {
    if (this.params().linkType === 'u') return null;
    const recordMap = this.ctx.recordMap();
    const id = this.params().id;
    if (!recordMap) return null;
    const linkedBlock = recordMap.block[id]?.value;

    if (!linkedBlock) {
      console.error('"‣" missing block', this.params().linkType, id);
      return null;
    } else {
      return linkedBlock;
    }
  });

  readonly userInfo = computed<null | { user: User; name: string }>(() => {
    if (this.params().linkType !== 'u') return null;
    const recordMap = this.ctx.recordMap();
    const id = this.params().id;
    if (!recordMap) return null;
    const user = recordMap.notion_user[id]?.value;

    if (!user) {
      console.error('"‣" missing user', id);
      return null;
    }

    const name = [user.given_name, user.family_name].filter(Boolean).join(' ');

    return {
      user,
      name,
    };
  });
}
