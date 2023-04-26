import { LazyQueryHookOptions } from '@apollo/client';

import {
  SearchTagsQuery as TagsType,
  SearchTagsQueryVariables as TagsVariables,
  SearchTagsDocument,
} from '../../generated/server';
import { useLazyQuery } from '../../utils';

export function useTags(
  options?: LazyQueryHookOptions<TagsType, TagsVariables>,
) {
  const [getTags, { data, loading, error, refetch }] = useLazyQuery<
    TagsType,
    TagsVariables
  >(SearchTagsDocument, {
    ...options,
  });

  return { getTags, data, loading, error, refetch };
}
