import { RestLink } from 'apollo-link-rest';

import { GetThreadMessagesQueryVariables } from '../../generatedAPI/server';

/**
 * Constructs the API URL for retrieving thread details.
 *
 * This function dynamically builds a REST API URL with query parameters
 * based on the provided arguments. It ensures required parameters are
 * included and filters out undefined values.
 *
 * Example:
 * Given arguments `{ channelId: 3, threadId: 13, direction: "past", limit: 50, targetMessageId: 129 }`,
 * the constructed URL will be:
 * `chat/api/channels/3/threads/13/messages?direction=past&page_size=50&target_message_id=129`
 *
 * @param {RestLink.PathBuilderProps} props - The properties passed by Apollo's REST Link.
 * @param {GetThreadMessagesQueryVariables} props.args - Arguments containing query parameters:
 *   @param {number} props.args.channelId - The ID of the channel (required).
 *   @param {number} props.args.threadId - The ID of the thread (required).
 *   @param {number} [props.args.limit=50] - The number of messages to fetch (default: 50).
 *   @param {DirectionPagination} [props.args.direction] - The pagination direction (`past` or `future`).
 *   @param {number} [props.args.targetMessageId] - The ID of the target message for pagination.
 * @returns {string} - The constructed URL with query parameters.
 */

export const threadMessagesPathBuilder = ({
  args,
}: RestLink.PathBuilderProps & {
  args: GetThreadMessagesQueryVariables;
}): string => {
  const { limit = 50, channelId, threadId, direction, targetMessageId } = args;

  const queryParams = new URLSearchParams();
  if (direction) {
    queryParams.append('direction', direction);
  }
  if (targetMessageId) {
    queryParams.append('target_message_id', String(targetMessageId));
  }
  queryParams.append('page_size', String(limit));

  return `/chat/api/channels/${channelId}/threads/${threadId}/messages.json?${queryParams.toString()}`;
};
