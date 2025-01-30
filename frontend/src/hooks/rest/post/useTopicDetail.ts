import { QueryHookOptions } from '@apollo/client';

import { topicsDetailPathBuilder } from '../../../api/pathBuilder';
import {
  GetTopicDetailDocument,
  GetTopicDetailQuery as TopicDetailType,
  GetTopicDetailQueryVariables as TopicDetailVariables,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

export function useTopicDetail(
  options?: QueryHookOptions<TopicDetailType, TopicDetailVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  let variables = options && options.variables;

  if (variables) {
    const topicDetailPath = topicsDetailPathBuilder;

    variables = { ...variables, topicDetailPath };
  }

  const { data, loading, error, fetchMore, refetch } = useQuery<
    TopicDetailType,
    TopicDetailVariables
  >(GetTopicDetailDocument, { ...options, variables }, errorAlert);

  return { data, loading, error, refetch, fetchMore };
}
