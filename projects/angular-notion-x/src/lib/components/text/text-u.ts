import { Component, computed, forwardRef, inject, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { AnGracefulImageComponent } from '../graceful-image.component';
import { AnPageTitleComponent } from '../page-title.component';
import { NotionContextService } from '../../context.service';
import { Block, User } from 'notion-types';
import { SubDecoration, UserFormat } from 'notion-types/build/core';

@Component({
  selector: 'an-text-u',
  template: `
    @if (userInfo()) {
      <an-graceful-image
        class="notion-user"
        [src]="ctx.mapImageUrl()(userInfo()!.user.profile_photo, block())"
        [alt]="userInfo()!.name"
      />
    }
  `,
  standalone: true,
  imports: [
    NgComponentOutlet,
    AnGracefulImageComponent,
    forwardRef(() => AnPageTitleComponent),
  ],
})
export class AnTextUComponent {
  readonly ctx = inject(NotionContextService);
  readonly block = input.required<Block>();
  readonly decorator = input.required<SubDecoration>();

  readonly userInfo = computed<null | { user: User; name: string }>(() => {
    const decorator = this.decorator() as UserFormat;
    const userId = decorator[1];
    const recordMap = this.ctx.recordMap();
    if (!recordMap) return null;
    const user = recordMap.notion_user[userId]?.value;

    if (!user) {
      console.error('missing user', userId);
      return null;
    }

    const name = [user.given_name, user.family_name].filter(Boolean).join(' ');

    return {
      user,
      name,
    };
  });
}
