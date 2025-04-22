import { RestLink } from 'apollo-link-rest';

import { generateMarkdownContent } from '../../helpers/api';
import { ChatMessage } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const getThreadMessagesOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
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
        time: message.createdAt,
        markdownContent,
        // Reply count only show on thread for first thread message
        replyCount: message.thread ? message.thread.replyCount : null,
        user: {
          ...message.user,
          avatar: getNormalizedUrlTemplate({ instance: message.user }),
        },
      };
    });
  }

  return {
    ...data,
    __typename: 'GetThreadMessagesOutput',
  };
};
