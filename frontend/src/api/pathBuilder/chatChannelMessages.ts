import { RestLink } from 'apollo-link-rest';

import { CHAT_CHANNEL_DETAIL_PAGE_SIZE } from '../../constants';

export const chatChannelMessagesPathBuilder = ({
  args,
}: RestLink.PathBuilderProps) => {
  const queryParams = new URLSearchParams();
  queryParams.set('fetch_from_last_read', args.targetMessageId ? '' : 'true');
  queryParams.set('page_size', args.pageSize || CHAT_CHANNEL_DETAIL_PAGE_SIZE);
  queryParams.set('target_message_id', args.targetMessageId || '');

  if (args.direction) {
    queryParams.set('direction', args.direction);
  }

  return `/chat/api/channels/${
    args.channelId
  }/messages.json?${queryParams.toString()}`;
};
