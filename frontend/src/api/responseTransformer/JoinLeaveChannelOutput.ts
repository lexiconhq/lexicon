/**
 * Transforms the response data for joining a channel.
 *
 * Original response structure:
 * {
 *   membership: {
 *     "following": true,
 *     "muted": false,
 *     "notification_level": "",
 *     "chat_channel_id": 0,
 *     "last_read_message_id": null,
 *     "last_viewed_at": "",
 *     "user": {
 *       "id": 0,
 *       "username": "",
 *       "name": null,
 *       "avatar_template": "",
 *       "can_chat": true,
 *       "has_chat_enabled": true
 *     }
 *   }
 * }
 *
 * Transformed structure:
 * Extracts only the `chat_channel_id` value from the `membership` object:
 * {
 *   chat_channel_id: 0
 * }
 */

export const joinLeaveChannelOutputResponseTransform = (data: {
  membership: { chat_channel_id: number };
}) => {
  return data.membership;
};
