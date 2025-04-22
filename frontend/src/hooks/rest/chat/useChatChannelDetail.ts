import { QueryHookOptions } from '@apollo/client';

import {
  GetChatChannelDetailDocument,
  GetChatChannelDetailQuery,
  GetChatChannelDetailQueryVariables,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useLazyQuery } from '../../../utils';

export function useChatChannelDetail(
  options?: QueryHookOptions<
    GetChatChannelDetailQuery,
    GetChatChannelDetailQueryVariables
  >,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getChatChannelDetail, { data, loading, error }] = useLazyQuery<
    GetChatChannelDetailQuery,
    GetChatChannelDetailQueryVariables
  >(GetChatChannelDetailDocument, { ...options }, errorAlert);

  return { getChatChannelDetail, data, loading, error };
}
