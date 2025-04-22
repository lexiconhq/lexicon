import { FetchMoreQueryOptions, LazyQueryHookOptions } from '@apollo/client';

import { chatChannelMessagesPathBuilder } from '../../../api/pathBuilder';
import {
  GetChatChannelMessagesDocument,
  GetChatChannelMessagesQuery,
  GetChatChannelMessagesQueryVariables,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useLazyQuery } from '../../../utils';

export function useChatChannelMessages(
  options?: LazyQueryHookOptions<
    GetChatChannelMessagesQuery,
    GetChatChannelMessagesQueryVariables
  >,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  let variables = options && options.variables;

  if (variables) {
    variables = {
      ...variables,
      chatChannelMessagesPath: chatChannelMessagesPathBuilder,
    };
  }

  const [
    getChatChannelMessagesQuery,
    { data, loading, error, fetchMore: fetchMoreQuery, refetch },
  ] = useLazyQuery<
    GetChatChannelMessagesQuery,
    GetChatChannelMessagesQueryVariables
  >(GetChatChannelMessagesDocument, { ...options, variables }, errorAlert);

  const getChatChannelMessages = (args: {
    variables: GetChatChannelMessagesQueryVariables;
  }) => {
    return getChatChannelMessagesQuery({
      ...args,
      variables: {
        ...args.variables,
        chatChannelMessagesPath: chatChannelMessagesPathBuilder,
      },
    });
  };

  const fetchMore = (
    fetchMoreOptions: FetchMoreQueryOptions<
      GetChatChannelMessagesQueryVariables,
      GetChatChannelMessagesQuery
    >,
  ) => {
    return fetchMoreQuery({
      ...fetchMoreOptions,
      variables: {
        ...fetchMoreOptions.variables,
        chatChannelMessagesPath: chatChannelMessagesPathBuilder,
      },
    });
  };

  return { getChatChannelMessages, data, loading, error, refetch, fetchMore };
}
