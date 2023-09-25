import { QueryHookOptions } from '@apollo/client';

import {
  GetTopicDetailQuery as TopicDetailType,
  GetTopicDetailQueryVariables as TopicDetailVariables,
  GetTopicDetailDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useTopicDetail(
  options?: QueryHookOptions<TopicDetailType, TopicDetailVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, fetchMore, refetch } = useQuery<
    TopicDetailType,
    TopicDetailVariables
  >(GetTopicDetailDocument, { ...options }, errorAlert);

  return { data, loading, error, refetch, fetchMore };
}
