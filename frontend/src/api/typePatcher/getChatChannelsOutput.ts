import { RestLink } from 'apollo-link-rest';

import { Channel } from '../../types/api';

/**
 * This function processes and transforms the channels data returned from the API into a more usable format.
 * It extracts and renames specific properties to make them more consistent with the application's requirements.
 *
 * Example input data format:
 * {
 *   "id": 2,
 *   "chatable": {
 *     "color": "25AAE2",
 *   },
 *   "title": "General",
 *   "slug": "general",
 *   "status": "open",
 *   "current_user_membership": {
 *     "following": true,
 *     "last_read_message_id": null,
 *   },
 *   "threading_enabled": false
 *   "meta": {
 *     "can_join_chat_channel": true,
 *   },
 *   "last_message": {
 *     "id": null,
 *   }
 * }
 *
 * The function performs the following transformations:
 * - `color`: Extracts `color` from `chatable.color` and makes it a top-level property.
 * - `canJoinChannel`: Renames `meta.canJoinChatChannel` to `canJoinChannel`.
 * - `lastMessageId`: Renames `lastMessage.id` to `lastMessageId`.
 * - `lastReadMessageId`: Extracts `currentUserMembership.lastReadMessageId`.
 * - `isFollowingChannel`: Renames `currentUserMembership.following` to `isFollowingChannel`, with a fallback to `false` if undefined.
 *
 * Example output format:
 * {
 *   __typename: "GetChatChannelsOutput",
 *   channels: [
 *     {
 *       id: 2,
 *       color: "25AAE2",
 *       canJoinChannel: true,
 *       lastMessageId: null,
 *       lastReadMessageId: null,
 *       isFollowingChannel: true,
 *       ...
 *     }
 *   ]
 * }
 *
 * @returns {object} - The transformed channels data with the changes mentioned above.
 */

export function generateChannelListPatcher(data: Channel) {
  return {
    __typename: 'ChannelList',
    ...data,
    color: data.chatable.color,
    canJoinChannel: data.meta.canJoinChatChannel,
    lastMessageId: data.lastMessage.id,
    lastReadMessageId: data.currentUserMembership?.lastReadMessageId || null, // compare lastReadMessageId with lastMessageId to check if there is unread chat
    isFollowingChannel: data.currentUserMembership?.following ?? false, // false mean user haven't join the channel
  };
}

export const getChannelsOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  data.channels = data.channels.map((channel: Channel) => {
    return generateChannelListPatcher(channel);
  });

  return {
    __typename: 'GetChatChannelsOutput',
    ...data,
  };
};

export const channelDetailOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  return {
    __typename: 'ChatChannelDetailOutput',
    channel: generateChannelListPatcher(data.channel),
  };
};
