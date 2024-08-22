import { ExtendedRecordMap } from 'notion-types';

export const defaultMapPageUrl =
  (rootPageId: string, recordMap?: ExtendedRecordMap | undefined) =>
  (pageId: string) => {
    pageId = (pageId || '').replace(/-/g, '');

    if (rootPageId && pageId === rootPageId) {
      return '/';
    } else {
      return `/${pageId}`;
    }
  };
