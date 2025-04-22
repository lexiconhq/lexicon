import { RestLink } from 'apollo-link-rest';

import { generateMarkdownContent } from '../../helpers/api';
import { ChatMessage } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const chatChannelMessagesOutputPatcher: RestLink.FunctionalTypePatcher =
  (data) => {
    if (data.messages) {
      data.messages = data.messages.map((message: ChatMessage) => {
        const markdownContent = message?.message
          ? message?.cooked
            ? generateMarkdownContent(message.message, message.cooked)
            : message.message
          : null;
        return {
          ...message,
          __typename: 'ChatMessage',
          replyCount: message.thread ? message.thread.replyCount : 0,
          time: message.createdAt,
          markdownContent,
          user: {
            ...message.user,
            avatar: getNormalizedUrlTemplate({ instance: message.user }),
          },
        };
      });
    }

    return {
      ...data,
      canLoadMorePast: data.meta.canLoadMorePast ?? false,
      canLoadMoreFuture: data.meta.canLoadMoreFuture ?? false,
      __typename: 'ChatChannelMessages',
    };
  };
