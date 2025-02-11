import { LazyQueryHookOptions, QueryHookOptions } from '@apollo/client';

import { topicsPathBuilder } from '../../../api/pathBuilder';
import {
  TopicsQuery as TopicListType,
  TopicsQueryVariables as TopicListVariables,
  TopicsDocument,
} from '../../../generatedAPI/server';
import { useLazyQuery, useQuery } from '../../../utils';

export function useTopicList(
  options?: QueryHookOptions<TopicListType, TopicListVariables>,
) {
  let variables = options && options.variables;

  if (variables && options?.variables) {
    const topicsPath = topicsPathBuilder;

    variables = { ...variables, topicsPath };
  }

  const { data, loading, error } = useQuery<TopicListType, TopicListVariables>(
    TopicsDocument,
    {
      context: { queryDeduplication: true },
      ...options,
      variables,
    },
  );

  return { data, loading, error };
}

export function useLazyTopicList(
  options?: LazyQueryHookOptions<TopicListType, TopicListVariables>,
) {
  const [getTopicListMutateFunc, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery<TopicListType, TopicListVariables>(TopicsDocument, {
      context: { queryDeduplication: true },
      ...options,
    });

  const getTopicList = (args: { variables: TopicListVariables }) => {
    return getTopicListMutateFunc({
      ...args,
      variables: {
        ...args.variables,
        topicsPath: topicsPathBuilder,
      },
    });
  };

  return { getTopicList, loading, error, refetch, fetchMore, data };
}
