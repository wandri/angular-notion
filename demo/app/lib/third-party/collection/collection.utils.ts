import { format } from 'date-fns/format';
import { Collection, CollectionView } from 'notion-types';

export function getCollectionGroups(
  collection: Collection,
  collectionView: CollectionView,
  collectionData: any,
  ...rest: any
) {
  const elems = collectionView?.format?.collection_groups || [];
  return elems?.map(
    (params: {
      property: any;
      hidden: any;
      value: { value: any; type: any };
    }) => {
      const value = params.value.value;
      const type = params.value.type;
      const hidden = params.hidden;
      const property = params.property;
      const isUncategorizedValue = typeof value === 'undefined';
      const isDateValue = value?.range;
      // TODO: review dates reducers
      const queryLabel = isUncategorizedValue
        ? 'uncategorized'
        : isDateValue
          ? value.range?.start_date || value.range?.end_date
          : value?.value || value;

      const collectionGroup = collectionData[`results:${type}:${queryLabel}`];
      let queryValue =
        !isUncategorizedValue && (isDateValue || value?.value || value);
      let schema = collection.schema[property];

      // Checkbox boolen value must be Yes||No
      if (type === 'checkbox' && value) {
        queryValue = 'Yes';
      }

      if (isDateValue) {
        schema = {
          type: 'text',
          name: 'text',
        };

        // TODO: review dates format based on value.type ('week'|'month'|'year')
        queryValue = format(new Date(queryLabel), 'MMM d, yyy hh:mm aa');
      }

      return {
        collectionGroup,
        schema,
        value: queryValue || 'No description',
        hidden,
        collection,
        collectionView,
        collectionData,
        blockIds: collectionGroup?.blockIds,
        ...rest,
      };
    },
  );
}
