import { LazyQueryHookOptions } from '@apollo/client';

import { SEARCH } from '../../graphql/server/search';
import {
  Search as SearchPostType,
  SearchVariables as SearchPostVariables,
} from '../../generated/server/Search';
import { useLazyQuery } from '../../utils';

export function useSearchPost(
  options?: LazyQueryHookOptions<SearchPostType, SearchPostVariables>,
) {
  const [getPosts, { error, refetch, fetchMore }] = useLazyQuery<
    SearchPostType,
    SearchPostVariables
  >(SEARCH, {
    ...options,
  });

  return { getPosts, error, refetch, fetchMore };
}
