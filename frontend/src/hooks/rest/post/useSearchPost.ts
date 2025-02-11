import { LazyQueryHookOptions } from '@apollo/client';

import { searchPostPathBuilder } from '../../../api/pathBuilder';
import {
  SearchDocument,
  SearchQuery as SearchPostType,
  SearchQueryVariables as SearchPostVariables,
} from '../../../generatedAPI/server';
import { useLazyQuery } from '../../../utils';

export function useSearchPost(
  options?: LazyQueryHookOptions<SearchPostType, SearchPostVariables>,
) {
  const [getPostsLazyFunc, { data, error, refetch, fetchMore }] = useLazyQuery<
    SearchPostType,
    SearchPostVariables
  >(SearchDocument, {
    ...options,
  });

  const getPosts = (args: { variables: SearchPostVariables }) => {
    return getPostsLazyFunc({
      ...args,
      variables: {
        ...args.variables,
        searchPostPath: searchPostPathBuilder,
      },
    });
  };

  return { getPosts, data, error, refetch, fetchMore };
}
