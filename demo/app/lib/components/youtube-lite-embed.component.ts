import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export const qs = (params: Record<string, string>) => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    )
    .join('&');
};

@Component({
  selector: 'an-youTube-lite-embed',
  imports: [NgClass, NgStyle],
  template: `
    @if (parameters()) {
      <link rel="preload" [href]="parameters()!.posterUrl" as="image" />
      @if (isPreconnected()) {
        <!--  The iframe document and most of its subresources come from youtube.com -->
        <link rel="preconnect" [href]="parameters()!.ytUrl" />

        <!-- The botguard script is fetched off from google.com -->
        <link rel="preconnect" href="https://www.google.com" />
      }
      @if (isPreconnected() && adLinksPreconnect()) {
        <!--     Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling. -->
        <link rel="preconnect" href="https://static.doubleclick.net" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
      }
      <div
        (click)="onLoadIframe()"
        (mouseover)="warmConnections()"
        [ngClass]="[
          'notion-yt-lite',
          isIframeLoaded() ? 'notion-yt-loaded' : '',
          iframeInitialized() ? 'notion-yt-initialized' : '',
          className(),
        ]"
        [ngStyle]="style()"
      >
        <img
          [src]="parameters()!.posterUrl"
          class="notion-yt-thumbnail"
          [attr.loading]="lazyImage() ? 'lazy' : undefined"
          [alt]="alt()"
        />

        <div class="notion-yt-playbtn"></div>

        @if (iframeInitialized()) {
          <iframe
            width="560"
            height="315"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            [title]="iframeTitle()"
            [src]="parameters()!.iframeSrc"
            (load)="onIframeLoaded($event)"
          ></iframe>
        }
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
export class AnYoutubeLiteEmbedComponent {
  readonly id = input.required<string | undefined>();
  readonly style = input<Record<string, string>>({});
  readonly className = input<string>('');
  readonly defaultPlay = input<boolean>(false);
  readonly mute = input<boolean>(false);
  readonly lazyImage = input<boolean>(false);
  readonly adLinksPreconnect = input<boolean>(true);
  readonly iframeTitle = input<string>('YouTube video');
  readonly alt = input<string>('Video preview');
  readonly params = input<Record<string, string>>({});
  readonly isPreconnected = signal<boolean>(false);
  readonly iframeInitialized = signal<boolean>(false);
  readonly isIframeLoaded = signal<boolean>(false);
  private sanitize = inject(DomSanitizer);
  readonly parameters = computed<{
    posterUrl: SafeResourceUrl;
    ytUrl: SafeResourceUrl;
    iframeSrc: SafeResourceUrl;
  }>(() => {
    const muteParam = this.mute() || this.defaultPlay() ? '1' : '0'; // Default play must be muted
    const queryString = qs({
      autoplay: '1',
      mute: muteParam,
      ...this.params(),
    });
    // const mobileResolution = 'hqdefault'
    // const desktopResolution = 'maxresdefault'
    const resolution = 'hqdefault';
    const posterUrl = this.sanitize.bypassSecurityTrustResourceUrl(
      `https://i.ytimg.com/vi/${this.id()}/${resolution}.jpg`,
    );
    const ytUrl = 'https://www.youtube-nocookie.com';
    const iframeSrc = this.sanitize.bypassSecurityTrustResourceUrl(
      `${ytUrl}/embed/${this.id()}?${queryString}`,
    );
    return {
      posterUrl,
      ytUrl: this.sanitize.bypassSecurityTrustResourceUrl(ytUrl),
      iframeSrc,
    };
  });

  constructor() {
    effect(() => {
      this.iframeInitialized.set(this.defaultPlay());
    });
  }

  warmConnections() {
    if (this.isPreconnected()) return;
    this.isPreconnected.set(true);
  }

  onLoadIframe() {
    if (this.iframeInitialized()) return;
    this.iframeInitialized.set(true);
  }

  onIframeLoaded($event: Event) {
    this.isIframeLoaded.set(true);
  }
}
