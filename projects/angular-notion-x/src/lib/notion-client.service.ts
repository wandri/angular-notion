import { inject, Injectable } from '@angular/core';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  CollectionInstance,
  CollectionViewType,
  ExtendedRecordMap,
  PageChunk,
  RecordValues,
  SearchParams,
  SearchResults,
  User,
} from 'notion-types';
import {
  getBlockCollectionId,
  getPageContentBlockIds,
  parsePageId,
  uuidToId,
} from 'notion-utils';
import { HttpClient } from '@angular/common/http';
import { SignedUrlRequest, SignedUrlResponse } from './type';

@Injectable({
  providedIn: 'root',
})
export class NotionClientService {
  private http = inject(HttpClient);
  private _apiBaseUrl: string = 'https://www.notion.so/api/v3';
  private _authToken?: string;
  private _activeUser?: string;
  private _userTimeZone: string = 'America/New_York';

  setConfig({
    apiBaseUrl = 'https://www.notion.so/api/v3',
    authToken,
    activeUser,
    userTimeZone = 'America/New_York',
  }: {
    apiBaseUrl?: string;
    authToken?: string;
    userTimeZone?: string;
    activeUser?: string;
  } = {}) {
    this._apiBaseUrl = apiBaseUrl;
    this._authToken = authToken;
    this._activeUser = activeUser;
    this._userTimeZone = userTimeZone;
  }

  getPage(
    pageId: string,
    {
      concurrency = 3,
      fetchMissingBlocks = true,
      fetchCollections = true,
      signFileUrls = true,
      chunkLimit = 100,
      chunkNumber = 0,
    }: {
      concurrency?: number;
      fetchMissingBlocks?: boolean;
      fetchCollections?: boolean;
      signFileUrls?: boolean;
      chunkLimit?: number;
      chunkNumber?: number;
    } = {},
  ): Observable<ExtendedRecordMap> {
    return this.getPageRaw(pageId, {
      chunkLimit,
      chunkNumber,
    }).pipe(
      map((page) => {
        const recordMap = page?.recordMap as ExtendedRecordMap;

        if (!recordMap?.block) {
          throw new Error(`Notion page not found "${uuidToId(pageId)}"`);
        }

        // ensure that all top-level maps exist
        recordMap.collection = recordMap.collection ?? {};
        recordMap.collection_view = recordMap.collection_view ?? {};
        recordMap.notion_user = recordMap.notion_user ?? {};

        // additional mappings added for convenience
        // note: these are not native notion objects
        recordMap.collection_query = {};
        recordMap.signed_urls = {};

        return recordMap;
      }),
      switchMap((recordMap) => {
        if (fetchMissingBlocks) {
          return of(recordMap).pipe(
            switchMap((recordMap) => this.getMissingBlocks(recordMap)),
          );
        }
        return of(recordMap);
      }),
      switchMap((recordMap) => {
        const contentBlockIds = getPageContentBlockIds(recordMap);
        return of(recordMap).pipe(
          switchMap((recordMap) => {
            if (fetchCollections) {
              const allCollectionInstances: Array<{
                collectionId: string;
                collectionViewId: string;
              }> = contentBlockIds.flatMap((blockId) => {
                const block = recordMap.block[blockId].value;
                const collectionId =
                  block &&
                  (block.type === 'collection_view' ||
                    block.type === 'collection_view_page') &&
                  getBlockCollectionId(block, recordMap);

                if (collectionId) {
                  return block.view_ids?.map((collectionViewId) => ({
                    collectionId,
                    collectionViewId,
                  }));
                } else {
                  return [];
                }
              });

              if (allCollectionInstances.length === 0) {
                return of(recordMap);
              }

              return from(allCollectionInstances).pipe(
                mergeMap((collectionInstance) => {
                  const { collectionId, collectionViewId } = collectionInstance;
                  const collectionView =
                    recordMap.collection_view[collectionViewId]?.value;
                  return this.getCollectionData(
                    collectionId,
                    collectionViewId,
                    collectionView,
                  ).pipe(
                    map((collectionData) => {
                      recordMap.block = {
                        ...recordMap.block,
                        ...collectionData.recordMap.block,
                      };

                      recordMap.collection = {
                        ...recordMap.collection,
                        ...collectionData.recordMap.collection,
                      };

                      recordMap.collection_view = {
                        ...recordMap.collection_view,
                        ...collectionData.recordMap.collection_view,
                      };

                      recordMap.notion_user = {
                        ...recordMap.notion_user,
                        ...collectionData.recordMap.notion_user,
                      };

                      recordMap.collection_query![collectionId] = {
                        ...recordMap.collection_query![collectionId],
                        [collectionViewId]: (collectionData.result as any)
                          ?.reducerResults,
                      };

                      return recordMap;
                    }),
                    catchError((err) => {
                      console.warn(
                        'NotionAPI collectionQuery error',
                        pageId,
                        err.message,
                      );
                      return of(recordMap);
                    }),
                  );
                }, concurrency),
              );
            } else {
              return of(recordMap);
            }
          }),
          switchMap((recordMap) => {
            if (signFileUrls) {
              return this.addSignedUrls({ recordMap, contentBlockIds });
            }
            return of(recordMap);
          }),
        );
      }),
    );
  }

  getUsers(userIds: string[]) {
    return this.fetch<RecordValues<User>>({
      endpoint: 'getRecordValues',
      body: {
        requests: userIds.map((id) => ({ id, table: 'notion_user' })),
      },
    });
  }

  search(params: SearchParams): Observable<SearchResults> {
    const body = {
      type: 'BlocksInAncestor',
      source: 'quick_find_private ',
      ancestorId: parsePageId(params.ancestorId),
      sort: {
        field: 'relevance',
      },
      limit: params.limit || 20,
      query: params.query,
      filters: {
        isDeletedOnly: false,
        isNavigableOnly: false,
        excludeTemplates: true,
        requireEditPermissions: false,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {},
        ...params.filters,
      },
    };

    return this.fetch<SearchResults>({
      endpoint: 'search',
      body,
    });
  }

  private getMissingBlocks(
    recordMap: ExtendedRecordMap,
  ): Observable<ExtendedRecordMap> {
    const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
      (id) => !recordMap.block[id],
    );
    if (!pendingBlockIds.length) {
      return of(recordMap);
    }
    return this.getBlocks(pendingBlockIds).pipe(
      map((newBlocks) => {
        recordMap.block = { ...recordMap.block, ...newBlocks.recordMap.block };
        return recordMap;
      }),
      switchMap((recordMap) => this.getMissingBlocks(recordMap)),
    );
  }

  private addSignedUrls({
    recordMap,
    contentBlockIds,
  }: {
    recordMap: ExtendedRecordMap;
    contentBlockIds?: string[];
  }): Observable<ExtendedRecordMap> {
    recordMap.signed_urls = {};

    if (!contentBlockIds) {
      contentBlockIds = getPageContentBlockIds(recordMap);
    }

    const allFileInstances = contentBlockIds.flatMap((blockId) => {
      const block = recordMap.block[blockId]?.value;

      if (
        block &&
        (block.type === 'pdf' ||
          block.type === 'audio' ||
          (block.type === 'image' && block.file_ids?.length) ||
          block.type === 'video' ||
          block.type === 'file' ||
          block.type === 'page')
      ) {
        const source =
          block.type === 'page'
            ? block.format?.page_cover
            : block.properties?.source?.[0]?.[0];

        if (source) {
          if (!source.includes('secure.notion-static.com')) {
            return [];
          }

          return {
            permissionRecord: {
              table: 'block',
              id: block.id,
            },
            url: source,
          };
        }
      }

      return [];
    });

    if (allFileInstances.length > 0) {
      return this.getSignedFileUrls(allFileInstances).pipe(
        map(({ signedUrls }) => {
          if (signedUrls.length === allFileInstances.length) {
            for (let i = 0; i < allFileInstances.length; ++i) {
              const file = allFileInstances[i];
              const signedUrl = signedUrls[i];

              recordMap.signed_urls[file.permissionRecord.id] = signedUrl;
            }
          }
          return recordMap;
        }),
        catchError((err) => {
          console.warn('NotionAPI getSignedfileUrls error', err);
          return of(recordMap);
        }),
      );
    }

    return of(recordMap);
  }

  private getPageRaw(
    pageId: string,
    {
      chunkLimit = 100,
      chunkNumber = 0,
    }: {
      chunkLimit?: number;
      chunkNumber?: number;
    } = {},
  ) {
    const parsedPageId = parsePageId(pageId);

    if (!parsedPageId) {
      throw new Error(`invalid notion pageId "${pageId}"`);
    }

    const body = {
      pageId: parsedPageId,
      limit: chunkLimit,
      chunkNumber: chunkNumber,
      cursor: { stack: [] },
      verticalColumns: false,
    };

    return this.fetch<PageChunk>({
      endpoint: 'loadPageChunk',
      body,
    });
  }

  private getCollectionData(
    collectionId: string,
    collectionViewId: string,
    collectionView: any,
    {
      limit = 9999,
      searchQuery = '',
      userTimeZone = this._userTimeZone,
      loadContentCover = true,
    }: {
      type?: CollectionViewType;
      limit?: number;
      searchQuery?: string;
      userTimeZone?: string;
      userLocale?: string;
      loadContentCover?: boolean;
    } = {},
  ) {
    const type = collectionView?.type;
    const isBoardType = type === 'board';
    const groupBy = isBoardType
      ? collectionView?.format?.board_columns_by
      : collectionView?.format?.collection_group_by;

    let filters = [];
    if (collectionView?.format?.property_filters) {
      filters = collectionView.format?.property_filters.map(
        (filterObj: any) => {
          //get the inner filter
          return {
            filter: filterObj?.filter?.filter,
            property: filterObj?.filter?.property,
          };
        },
      );
    }

    //Fixes formula filters from not working
    if (collectionView?.query2?.filter?.filters) {
      filters.push(...collectionView.query2.filter.filters);
    }

    let loader: any = {
      type: 'reducer',
      reducers: {
        collection_group_results: {
          type: 'results',
          limit,
          loadContentCover,
        },
      },
      sort: [],
      ...collectionView?.query2,
      filter: {
        filters: filters,
        operator: 'and',
      },
      searchQuery,
      userTimeZone,
    };

    if (groupBy) {
      const groups =
        collectionView?.format?.board_columns ||
        collectionView?.format?.collection_groups ||
        [];
      const iterators = [
        isBoardType ? 'board' : 'group_aggregation',
        'results',
      ];
      const operators: Record<string, string> = {
        checkbox: 'checkbox_is',
        url: 'string_starts_with',
        text: 'string_starts_with',
        select: 'enum_is',
        multi_select: 'enum_contains',
        created_time: 'date_is_within',
        ['undefined']: 'is_empty',
      };

      const reducersQuery: Record<string, any> = {};
      for (const group of groups) {
        const {
          property,
          value: { value, type },
        } = group;

        for (const iterator of iterators) {
          const iteratorProps =
            iterator === 'results'
              ? {
                  type: iterator,
                  limit,
                }
              : {
                  type: 'aggregation',
                  aggregation: {
                    aggregator: 'count',
                  },
                };

          const isUncategorizedValue = typeof value === 'undefined';
          const isDateValue = value?.range;
          // TODO: review dates reducers
          const queryLabel = isUncategorizedValue
            ? 'uncategorized'
            : isDateValue
              ? value.range?.start_date || value.range?.end_date
              : value?.value || value;

          const queryValue =
            !isUncategorizedValue && (isDateValue || value?.value || value);

          reducersQuery[`${iterator}:${type}:${queryLabel}`] = {
            ...iteratorProps,
            filter: {
              operator: 'and',
              filters: [
                {
                  property,
                  filter: {
                    operator: !isUncategorizedValue
                      ? operators[type]
                      : 'is_empty',
                    ...(!isUncategorizedValue && {
                      value: {
                        type: 'exact',
                        value: queryValue,
                      },
                    }),
                  },
                },
              ],
            },
          };
        }
      }

      const reducerLabel = isBoardType ? 'board_columns' : `${type}_groups`;
      loader = {
        type: 'reducer',
        reducers: {
          [reducerLabel]: {
            type: 'groups',
            groupBy,
            ...(collectionView?.query2?.filter && {
              filter: collectionView?.query2?.filter,
            }),
            groupSortPreference: groups.map((group: any) => group?.value),
            limit,
          },
          ...reducersQuery,
        },
        ...collectionView?.query2,
        searchQuery,
        userTimeZone,
        //TODO: add filters here
        filter: {
          filters: filters,
          operator: 'and',
        },
      };
    }

    return this.fetch<CollectionInstance>({
      endpoint: 'queryCollection',
      body: {
        collection: {
          id: collectionId,
        },
        collectionView: {
          id: collectionViewId,
        },
        loader,
      },
    });
  }

  private getBlocks(blockIds: string[]): Observable<PageChunk> {
    return this.fetch<PageChunk>({
      endpoint: 'syncRecordValues',
      body: {
        requests: blockIds.map((blockId) => ({
          // TODO: when to use table 'space' vs 'block'?
          table: 'block',
          id: blockId,
          version: -1,
        })),
      },
    });
  }

  private getSignedFileUrls(
    urls: SignedUrlRequest[],
  ): Observable<SignedUrlResponse> {
    return this.fetch<SignedUrlResponse>({
      endpoint: 'getSignedFileUrls',
      body: {
        urls,
      },
    });
  }

  private fetch<T>({
    endpoint,
    body,
    headers: clientHeaders,
  }: {
    endpoint: string;
    body: object;
    headers?: any;
  }): Observable<T> {
    const headers: any = {
      ...clientHeaders,
      'Content-Type': 'application/json',
    };

    if (this._authToken) {
      headers.cookie = `token_v2=${this._authToken}`;
    }

    if (this._activeUser) {
      headers['x-notion-active-user-header'] = this._activeUser;
    }

    const url = `${this._apiBaseUrl}/${endpoint}`;
    return this.http.post<T>(url, body, { headers });
  }
}
