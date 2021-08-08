import { LazyQueryHookOptions } from '@apollo/client';

import {
  SearchTags as TagsType,
  SearchTagsVariables as TagsVariables,
} from '../../generated/server/SearchTags';
import { SEARCH_TAGS } from '../../graphql/server/search';
import { useLazyQuery } from '../../utils';

export function useTags(
  options?: LazyQueryHookOptions<TagsType, TagsVariables>,
) {
  const [getTags, { data, loading, error, refetch }] = useLazyQuery<
    TagsType,
    TagsVariables
  >(SEARCH_TAGS, {
    ...options,
  });

  return { getTags, data, loading, error, refetch };
}
