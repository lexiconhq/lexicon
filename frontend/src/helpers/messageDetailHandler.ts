import {
  Message,
  MessageContent,
  PostStream,
  TopicDetailInner as TopicDetail,
} from '../types';

import { formatRelativeTime } from './formatRelativeTime';
import { getImage } from './getUserImage';

type MessageDetailContent = {
  postStream: PostStream;
  details: TopicDetail | null;
};

export function messageDetailHandler({
  postStream,
  details,
}: MessageDetailContent) {
  const contents = getSortedContent(postStream, details);
  const members =
    details?.allowedUsers?.map(({ id, username, avatarTemplate: avatar }) => ({
      id,
      username,
      avatar: getImage(avatar),
    })) || [];

  const data: Message = { contents, members };
  const baseStream = postStream.stream || [];

  const { id: oldestPostId } = contents[0];
  const { id: newestPostId } = contents[contents.length - 1];

  const hasOlderMessage = baseStream[0] !== oldestPostId;
  const hasNewerMessage = baseStream[baseStream.length - 1] !== newestPostId;

  const firstPostIndex = baseStream.findIndex(
    (postId) => postId === oldestPostId,
  );
  const lastPostIndex = baseStream.findIndex(
    (postId) => postId === newestPostId,
  );

  return {
    data,
    hasNewerMessage,
    hasOlderMessage,
    baseStream,
    firstPostIndex,
    lastPostIndex,
  };
}

function getSortedContent(postStream: PostStream, details: TopicDetail | null) {
  let tempContent: Array<MessageContent> = [];
  const { posts, stream } = postStream;

  if (stream) {
    stream.forEach((streamId) => {
      const tempPost = posts.find(({ id }) => id === streamId);

      if (tempPost) {
        let {
          id,
          username,
          createdAt: time,
          actionCode,
          actionCodeWho,
          listOfCooked: images,
          listOfMention,
          raw,
        } = tempPost;

        tempContent.push({
          id,
          userId:
            details?.participants.find(
              (participant) => participant.username === username,
            )?.id || 0,
          time,
          message: getMessageContent(
            username,
            raw ?? null,
            actionCode ?? null,
            actionCodeWho ?? null,
            time,
          ),
          images: images || undefined,
          listOfMention: listOfMention || undefined,
        });
      }
    });
  } else {
    posts.forEach(
      ({
        id,
        username,
        createdAt: time,
        actionCode,
        actionCodeWho,
        listOfCooked: images,
        listOfMention,
        raw,
      }) =>
        tempContent.push({
          id,
          userId:
            details?.participants.find(
              (participant) => participant.username === username,
            )?.id || 0,
          time,
          message: getMessageContent(
            username,
            raw ?? null,
            actionCode ?? null,
            actionCodeWho ?? null,
            time,
          ),
          images: images || undefined,
          listOfMention: listOfMention || undefined,
        }),
    );
  }

  return tempContent;
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

  switch (actionCode) {
    case 'user_left': {
      return `${actionCodeWho} removed themselves ${timeStamp}`;
    }
    case 'invited_user': {
      return `${username} invited ${actionCodeWho} to join ${timeStamp}`;
    }
    case 'removed_user': {
      return `${username} removed ${actionCodeWho} ${timeStamp}`;
    }
    case 'public_topic': {
      return `${username} made this message public ${timeStamp}`;
    }
    case 'private_topic': {
      return `${username} made this message personal ${timeStamp}`;
    }
    case 'visible.enabled': {
      return `${username} listed this message ${timeStamp}`;
    }
    case 'visible.disabled': {
      return `${username} unlisted this message ${timeStamp}`;
    }
    case 'closed.enabled': {
      return `${username} closed this message ${timeStamp}`;
    }
    case 'closed.disabled': {
      return `${username} opened this message ${timeStamp}`;
    }
    default: {
      return '';
    }
  }
}
