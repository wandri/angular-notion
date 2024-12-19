import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { NotionClientService } from './lib/notion-client.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const dataService = inject(NotionClientService);
      const content = await dataService
        .getPage('067dd719a912471ea9a3ac10710e7fdf')
        .toPromise();
      const blockIds: string[] = Object.keys(content?.block ?? {});
      const pageIds = blockIds.filter(
        (blockId) =>
          !!content &&
          !!content.block &&
          content.block[blockId].value.type === 'page',
      );
      console.log({ pageIds });
      return [
        { id: '0be6efce9daf42688f65c76b89f8eb27' },
        { id: '067dd719a912471ea9a3ac10710e7fdf' },
      ];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
