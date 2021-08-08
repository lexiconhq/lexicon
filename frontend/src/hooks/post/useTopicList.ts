import { LazyQueryHookOptions, QueryHookOptions } from '@apollo/client';

import {
  Topics as TopicListType,
  TopicsVariables as TopicListVariables,
} from '../../generated/server/Topics';
import { TOPICS } from '../../graphql/server/topics';
import { useLazyQuery, useQuery } from '../../utils';

export function useTopicList(
  options?: QueryHookOptions<TopicListType, TopicListVariables>,
) {
  const { data, loading, error } = useQuery<TopicListType, TopicListVariables>(
    TOPICS,
    {
      ...options,
    },
  );

  return { data, loading, error };
}

export function useLazyTopicList(
  options?: LazyQueryHookOptions<TopicListType, TopicListVariables>,
) {
  const [getTopicList, { loading, error, refetch, fetchMore }] = useLazyQuery<
    TopicListType,
    TopicListVariables
  >(TOPICS, { ...options });

  return { getTopicList, loading, error, refetch, fetchMore };
}
