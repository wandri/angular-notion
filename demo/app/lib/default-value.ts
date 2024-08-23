import { NotionComponents, NotionContext } from './type';
import { defaultMapPageUrl } from './map-page-url';
import { defaultMapImageUrl } from './map-image-url';
import { AnAssetWrapperBlockComponent } from './block/asset-wrapper.block';
import { AnCheckboxComponent } from './components/checkbox.component';
import { AnHeaderComponent } from './components/header.component';

function dummyComponent(name: string) {
  console.warn(
    `Warning: using empty component "${name}" (you should override this in components)`,
  );

  return null;
}

const DefaultCheckbox = AnCheckboxComponent;
const DefaultEmbed = AnAssetWrapperBlockComponent;
const DefaultHeader = AnHeaderComponent;

export const defaultComponents: NotionComponents = {
  Image: null, // disable custom images by default
  Link: null,
  PageLink: null,
  Checkbox: DefaultCheckbox,
  Callout: undefined, // use the built-in callout rendering by default

  Code: dummyComponent('Code'),
  Equation: dummyComponent('Equation'),

  Collection: dummyComponent('Collection'),
  Property: undefined, // use the built-in property rendering by default

  Pdf: dummyComponent('Pdf'),
  Tweet: dummyComponent('Tweet'),
  Modal: dummyComponent('Modal'),

  Header: DefaultHeader,
  Embed: DefaultEmbed,
};

export const defaultNotionContext: NotionContext = {
  recordMap: {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  },

  components: defaultComponents,

  mapPageUrl: defaultMapPageUrl(),
  mapImageUrl: defaultMapImageUrl,
  searchNotion: undefined,
  isShowingSearch: false,
  onHideSearch: undefined,

  fullPage: false,
  darkMode: false,
  previewImages: false,
  forceCustomImages: false,
  showCollectionViewDropdown: true,
  linkTableTitleProperties: true,
  isLinkCollectionToUrlProperty: false,

  showTableOfContents: false,
  minTableOfContentsItems: 3,

  defaultPageIcon: undefined,
  defaultPageCover: undefined,
  defaultPageCoverPosition: 0.5,

  zoom: null,
};
