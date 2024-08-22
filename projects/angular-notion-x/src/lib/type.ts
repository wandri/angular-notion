import {
  Block,
  ExtendedRecordMap,
  ID,
  SearchParams,
  SearchResults,
} from 'notion-types';
import { Type } from '@angular/core';

export interface SignedUrlRequest {
  permissionRecord: PermissionRecord;
  url: string;
}

export interface PermissionRecord {
  table: string;
  id: ID;
}

export interface SignedUrlResponse {
  signedUrls: string[];
}

export type AngularComponent = Type<any> | null;

export interface NotionComponents {
  Image: AngularComponent;
  Link: AngularComponent;
  PageLink: AngularComponent;
  Checkbox: AngularComponent;
  // blocks
  Code: AngularComponent;
  Equation: AngularComponent;
  Callout?: AngularComponent;
  // collection
  Collection: AngularComponent;
  Property?: AngularComponent;
  // assets
  Pdf: AngularComponent;
  Tweet: AngularComponent;
  Modal: AngularComponent;
  Embed: AngularComponent;
  // page navigation
  Header: AngularComponent;
  // optional next.js-specific overrides
  nextImage?: AngularComponent;
  nextLink?: AngularComponent;
}

export type MapPageUrlFn = (
  pageId: string,
  recordMap?: ExtendedRecordMap | undefined,
) => string;
export type MapImageUrlFn = (url: string, block: Block) => string;
export type SearchNotionFn = (params: SearchParams) => Promise<SearchResults>;
