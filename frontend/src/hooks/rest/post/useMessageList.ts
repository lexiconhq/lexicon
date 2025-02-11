import { QueryHookOptions } from '@apollo/client';

import {
  MessageListDocument,
  MessageListQuery as MessageListType,
  MessageListQueryVariables as MessageListVariables,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useQuery } from '../../../utils';

export function useMessageList(
  options?: QueryHookOptions<MessageListType, MessageListVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    MessageListType,
    MessageListVariables
  >(
    MessageListDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error, refetch, fetchMore };
}
