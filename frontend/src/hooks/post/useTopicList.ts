import { LazyQueryHookOptions, QueryHookOptions } from '@apollo/client';

import {
  TopicsQuery as TopicListType,
  TopicsQueryVariables as TopicListVariables,
  TopicsDocument,
} from '../../generated/server';
import { useLazyQuery, useQuery } from '../../utils';

export function useTopicList(
  options?: QueryHookOptions<TopicListType, TopicListVariables>,
) {
  const { data, loading, error } = useQuery<TopicListType, TopicListVariables>(
    TopicsDocument,
    { context: { queryDeduplication: true }, ...options },
  );

  return { data, loading, error };
}

export function useLazyTopicList(
  options?: LazyQueryHookOptions<TopicListType, TopicListVariables>,
) {
  const [getTopicList, { loading, error, refetch, fetchMore }] = useLazyQuery<
    TopicListType,
    TopicListVariables
  >(TopicsDocument, { context: { queryDeduplication: true }, ...options });

  return { getTopicList, loading, error, refetch, fetchMore };
}
