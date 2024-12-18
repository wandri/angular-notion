import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { AnTwitterService } from './tweet.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'an-tweet',
  imports: [],
  template: ` <div #tweetElement [attr.twElement]="'yes'"></div>`,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnTweetComponent implements AfterViewInit {
  readonly tweetElement = viewChild<ElementRef<HTMLElement>>('tweetElement');
  readonly twitterService = inject(AnTwitterService);
  readonly id = input.required<string | undefined>();
  readonly onLoad = output<any>();

  private platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  async ngAfterViewInit() {
    if (this.isBrowser) {
      await this.loadScript();
      await this.loadWidget();
    }
  }

  async loadWidget() {
    const element = this.tweetElement();
    if (element) {
      await this.twitterService.loadElement(
        'createTweet',
        this.id,
        element.nativeElement,
        (response: object) => {
          this.onLoad.emit(response);
        },
      );
    }
  }

  private async loadScript() {
    return new Promise((resolve, reject) => {
      this.twitterService
        .load()
        .then((data) => {
          resolve(true);
        })
        .catch((err) => {
          reject();
          console.info('Script load issue,');
        });
    });
  }
}
