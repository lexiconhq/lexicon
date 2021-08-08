import { QueryHookOptions } from '@apollo/client';

import {
  Message as MessageListType,
  MessageVariables as MessageListVariables,
} from '../../generated/server/Message';
import { MESSAGE } from '../../graphql/server/message';
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
    MESSAGE,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error, refetch, fetchMore };
}
