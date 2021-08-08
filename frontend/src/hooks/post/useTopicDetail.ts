import { QueryHookOptions } from '@apollo/client';

import {
  GetTopicDetail as TopicDetailType,
  GetTopicDetailVariables as TopicDetailVariables,
} from '../../generated/server/GetTopicDetail';
import { GET_TOPIC_DETAIL } from '../../graphql/server/getTopicDetail';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useTopicDetail(
  options?: QueryHookOptions<TopicDetailType, TopicDetailVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, fetchMore, refetch } = useQuery<
    TopicDetailType,
    TopicDetailVariables
  >(GET_TOPIC_DETAIL, { ...options }, errorAlert);

  return { data, loading, error, refetch, fetchMore };
}
