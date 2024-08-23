export function defaultMapPageUrl(rootPageId?: string) {
  return (pageId: string) => {
    pageId = (pageId || '').replace(/-/g, '');

    if (rootPageId && pageId === rootPageId) {
      return '/';
    } else {
      return `/${pageId}`;
    }
  };
}
