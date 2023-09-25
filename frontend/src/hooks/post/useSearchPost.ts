import { LazyQueryHookOptions } from '@apollo/client';

import {
  SearchQuery as SearchPostType,
  SearchQueryVariables as SearchPostVariables,
  SearchDocument,
} from '../../generated/server';
import { useLazyQuery } from '../../utils';

export function useSearchPost(
  options?: LazyQueryHookOptions<SearchPostType, SearchPostVariables>,
) {
  const [getPosts, { error, refetch, fetchMore }] = useLazyQuery<
    SearchPostType,
    SearchPostVariables
  >(SearchDocument, {
    ...options,
  });

  return { getPosts, error, refetch, fetchMore };
}
