import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import {
  MessageDocument,
  MessageQueryVariables as MessageListVariables,
  MessageQuery,
} from '../../../generatedAPI/server';
import { privateMessagesMerger } from '../../../helpers/api';
import { messagePathBuilder } from '../../pathBuilder';

export let privateMessageListQueryResolver = async (
  _: Record<string, unknown>,
  { username, page }: Pick<MessageListVariables, 'username' | 'page'>,
  { client }: { client: ApolloClient<NormalizedCacheObject> },
) => {
  const messagePath = messagePathBuilder;

  let { data: inbox } = await client.query<MessageQuery, MessageListVariables>({
    query: MessageDocument,
    variables: {
      username,
      page,
      messageType: 'inbox',
      messagePath,
    },
    fetchPolicy: 'network-only',
  });

  let { data: sent } = await client.query<MessageQuery, MessageListVariables>({
    query: MessageDocument,
    variables: {
      username,
      page,
      messageType: 'sent',
      messagePath,
    },
    fetchPolicy: 'network-only',
  });

  return privateMessagesMerger(
    inbox.privateMessageQuery,
    sent.privateMessageQuery,
  );
};
