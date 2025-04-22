import { ApolloQueryResult, FetchMoreQueryOptions } from '@apollo/client';

import {
  DirectionPagination,
  GetChatChannelMessagesQuery,
  GetChatChannelMessagesQueryVariables,
  GetThreadMessagesQuery,
  GetThreadMessagesQueryVariables,
} from '../generatedAPI/server';
import { ChatMessageContent } from '../types';

import { compareTime } from './compareTime';

type FetchData = GetThreadMessagesQuery | GetChatChannelMessagesQuery;
type FetchVariables =
  | GetThreadMessagesQueryVariables
  | GetChatChannelMessagesQueryVariables;

export type FetchMore = (
  fetchMoreOptions: FetchMoreQueryOptions<FetchVariables, FetchData>,
) => Promise<ApolloQueryResult<FetchData>>;

type FetchMoreParams = {
  loadingState: boolean;
  hasMoreMessages: boolean;
  isInitialRequest: boolean;
  channelId: number;
  pageSize: number;
  targetMessageId: number;
  direction?: DirectionPagination;
  fetchMore: FetchMore;
};

/**
 * Fetches more messages if additional messages are available and no other fetch operation is in progress.
 * Prevents duplicate or unnecessary fetch calls when messages are already loading or when an initial request is pending.
 *
 * @param {FetchMoreParams} params - The parameters for fetching more messages.
 * @param {boolean} params.loadingState - Indicates if a fetch request is currently in progress.
 * @param {boolean} params.hasMoreMessages - Determines if there are more messages to load.
 * @param {boolean} params.isInitialRequest - Prevents fetching if it's an initial request.
 * @param {Function} params.fetchMore - The function to fetch additional messages.
 * @param {number} params.channelId - The ID of the channel to fetch messages from.
 * @param {number} params.pageSize - The number of messages to fetch per request.
 * @param {number} params.targetMessageId - The ID of the target message for pagination.
 * @param {DirectionPagination} [params.direction] - The direction of pagination (optional).
 */
export const fetchPaginatedMessages = ({
  loadingState,
  hasMoreMessages,
  isInitialRequest,
  fetchMore,
  channelId,
  pageSize,
  targetMessageId,
  direction,
}: FetchMoreParams) => {
  if (loadingState || !hasMoreMessages || isInitialRequest) {
    return;
  }

  fetchMore({
    variables: {
      channelId,
      pageSize,
      targetMessageId,
      direction,
    },
  });
};

/**
 * Checks whether the sender of the current message is the same as the sender of the previous message.
 * This is useful for grouping consecutive messages from the same user in chat interfaces.
 *
 * @param {Array<ChatMessageContent>} messages - The list of chat or thread messages.
 * @param {number} currIndex - The index of the current message in the messages array.
 * @param {boolean} inverted - The indicator of the compare direction of a list, with previous or next item.
 * @returns {boolean} True if the sender is the same as the previous message sender, otherwise false.
 */
export const isSameSenderAsPreviousMessage = (
  messages: Array<ChatMessageContent>,
  currIndex: number,
  inverted = false,
) => {
  if (
    !messages.length ||
    (currIndex === 0 && !inverted) ||
    (currIndex === messages.length - 1 && inverted)
  ) {
    return false;
  }
  const comparedIndex = inverted ? currIndex + 1 : currIndex - 1;
  return (
    messages[currIndex].user.username === messages[comparedIndex].user.username
  );
};

/**
 * Determines whether a timestamp should be displayed for a given message.
 * A timestamp is displayed if:
 * - The message is the first in the list.
 * - The sender is different from the previous message.
 * - The message is considered a new timestamp block based on a time difference check.
 *
 * @param {Array<ChatMessageContent >} messages - The list of chat or thread messages.
 * @param {number} currIndex - The index of the current message in the messages array.
 * @param {boolean} inverted - The indicator of the compare direction of a list, with previous or next item.
 * @returns {boolean} True if a timestamp should be displayed, otherwise false.
 */
export const shouldDisplayTimestamp = (
  messages: Array<ChatMessageContent>,
  currIndex: number,
  inverted = false,
) => {
  if (
    currIndex === -1 ||
    !isSameSenderAsPreviousMessage(messages, currIndex, inverted)
  ) {
    return true;
  }
  return compareTime({ data: messages, currIndex, inverted }).isNewTimestamp;
};
