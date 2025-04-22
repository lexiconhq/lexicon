import { RestLink } from 'apollo-link-rest';

import { generateMarkdownContent } from '../../helpers/api';
import { ThreadDetail } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const getThreadDetailOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  if (data.thread) {
    const thread: ThreadDetail = data.thread;
    const originalMessage = thread.originalMessage;

    const markdownContent = originalMessage?.message
      ? originalMessage?.cooked
        ? generateMarkdownContent(
            originalMessage.message,
            originalMessage.cooked,
          )
        : originalMessage.message
      : null;

    data.thread.originalMessage = {
      ...originalMessage,
      __typename: 'OriginalMessage',
      time: originalMessage.createdAt,
      markdownContent,
      user: {
        ...originalMessage.user,
        avatar: getNormalizedUrlTemplate({ instance: originalMessage.user }),
      },
    };

    data.thread = {
      ...thread,
      __typename: 'ThreadDetail',
    };
  }

  return {
    ...data,
    __typename: 'GetThreadDetailOutput',
  };
};
