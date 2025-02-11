import { LazyQueryHookOptions } from '@apollo/client';

import { searchTagsPathBuilder } from '../../../api/pathBuilder';
import {
  SearchTagsDocument,
  SearchTagsQuery as TagsType,
  SearchTagsQueryVariables as TagsVariables,
} from '../../../generatedAPI/server';
import { useLazyQuery } from '../../../utils';

export function useTags(
  options?: LazyQueryHookOptions<TagsType, TagsVariables>,
) {
  let variables = options && options.variables;

  if (variables) {
    const searchPath = searchTagsPathBuilder;

    variables = { ...variables, searchPath, limit: variables.limit ?? 5 };
  }

  const [getTags, { data, loading, error, refetch }] = useLazyQuery(
    SearchTagsDocument,
    {
      ...options,
      variables,
    },
  );

  return { getTags, data, loading, error, refetch };
}
