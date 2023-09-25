import { GetMessageDetailQuery } from '../generated/server';
import {
  Message,
  MessageContent,
  TopicDetailInner as TopicDetail,
} from '../types';

import { formatRelativeTime } from './formatRelativeTime';
import { getImage } from './getUserImage';

type MessagePostStream =
  GetMessageDetailQuery['privateMessageDetail']['postStream'];

type MessageDetailContent = {
  postStream: MessagePostStream;
  details: TopicDetail | null;
};

export function messageDetailHandler({
  postStream,
  details,
}: MessageDetailContent) {
  const { posts, stream } = postStream;
  const contents = transformPostsToFrontendMessageContent(posts);
  const members =
    details?.allowedUsers?.map(({ id, username, avatarTemplate: avatar }) => ({
      id,
      username,
      avatar: getImage(avatar),
    })) || [];

  const data: Message = { contents, members };

  const { id: oldestPostId } = contents[0];
  const { id: newestPostId } = contents[contents.length - 1];

  let hasOlderMessage = false;
  let hasNewerMessage = false;
  let firstPostIndex: number | null = null;
  let lastPostIndex: number | null = null;

  if (stream) {
    hasOlderMessage = stream[0] !== oldestPostId;
    hasNewerMessage = stream[stream.length - 1] !== newestPostId;

    firstPostIndex = stream.findIndex((postId) => postId === oldestPostId);
    lastPostIndex = stream.findIndex((postId) => postId === newestPostId);
  }

  return {
    data,
    hasNewerMessage,
    hasOlderMessage,
    stream: stream ?? [],
    firstPostIndex,
    lastPostIndex,
  };
}

function transformPostsToFrontendMessageContent(
  posts: MessagePostStream['posts'],
) {
  const modifiedPosts: Array<MessageContent> = posts.map(
    ({
      id,
      username,
      createdAt: time,
      actionCode,
      actionCodeWho,
      markdownContent,
      mentions,
    }) => ({
      id,
      username,
      time,
      message: getMessageContent(
        username,
        markdownContent ?? null,
        actionCode ?? null,
        actionCodeWho ?? null,
        time,
      ),
      mentions: mentions ?? undefined,
    }),
  );
  return modifiedPosts;
}

function getMessageContent(
  username: string,
  raw: string | null,
  actionCode: string | null,
  actionCodeWho: string | null,
  time: string,
) {
  if (!actionCode) {
    return raw || '';
  }

  const timeStamp = formatRelativeTime(time);

  // TODO: Adjust message content in #865
  switch (actionCode) {
    case 'user_left': {
      return t('{actionCodeWho} left.', { actionCodeWho });
    }
    case 'invited_user': {
      return t('{username} invited {actionCodeWho} to join {timeStamp}', {
        username,
        actionCodeWho,
        timeStamp,
      });
    }
    case 'removed_user': {
      return t('{username} removed {actionCodeWho} {timeStamp}', {
        username,
        actionCodeWho,
        timeStamp,
      });
    }
    case 'public_topic': {
      return t('{username} made this message public {timeStamp}', {
        username,
        timeStamp,
      });
    }
    case 'private_topic': {
      return t('{username} made this message personal {timeStamp}', {
        username,
        timeStamp,
      });
    }
    case 'visible.enabled': {
      return t('{username} listed this message {timeStamp}', {
        username,
        timeStamp,
      });
    }
    case 'visible.disabled': {
      return t('{username} unlisted this message {timeStamp}', {
        username,
        timeStamp,
      });
    }
    case 'closed.enabled': {
      return t('{username} locked this message {timeStamp}', {
        username,
        timeStamp,
      });
    }
    case 'closed.disabled': {
      return t('{username} unlocked this message {timeStamp}', {
        username,
        timeStamp,
      });
    }
    default: {
      return '';
    }
  }
}
