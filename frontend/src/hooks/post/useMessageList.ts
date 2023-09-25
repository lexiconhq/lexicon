import { QueryHookOptions } from '@apollo/client';

import {
  MessageQuery as MessageListType,
  MessageQueryVariables as MessageListVariables,
  MessageDocument,
} from '../../generated/server';
import { ErrorAlertOptionType } from '../../types';
import { useQuery } from '../../utils';

export function useMessageList(
  options?: QueryHookOptions<MessageListType, MessageListVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    MessageListType,
    MessageListVariables
  >(
    MessageDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error, refetch, fetchMore };
}
