import { Injectable } from '@angular/core';

export class TweetOption {
  id?: string;
  cards?: string;
  conversation?: string;
  theme?: string;
  width?: string;
  align?: string;
  lang?: string;
  dnt?: boolean;
}

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'twttr', src: 'https://platform.twitter.com/widgets.js' },
];

@Injectable({
  providedIn: 'root',
})
export class AnTwitterService {
  private scripts: any = {};
  private scriptAttr: string | any = 'twttr';

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
      };
    });
  }

  load() {
    const promises: any[] = [];
    ['twttr'].forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script: any = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {
          //IE
          script.onreadystatechange = () => {
            if (
              script.readyState === 'loaded' ||
              script.readyState === 'complete'
            ) {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) =>
          resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

  async loadElement(
    widgetFunction: string,
    source: object | string,
    element: HTMLElement,
    onLoad: Function,
  ) {
    try {
      const wf: any = await this.twitterWidget();

      await wf[widgetFunction](source, element, {});

      onLoad({ status: true });
    } catch (error) {
      onLoad({ status: false, error });
      element.innerHTML = 'Issue on load Twitter Follow Button.';
    }
  }

  private twitterWidget() {
    return new Promise((resolve, reject) => {
      const twttr: any = window[this.scriptAttr];
      if (!twttr || !twttr.widgets) {
        reject();
      }
      resolve(twttr.widgets);
    });
  }
}
