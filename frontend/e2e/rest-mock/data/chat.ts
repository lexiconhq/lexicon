import { Channel, ChatMessage } from '../../../src/types/api';

import { mockUsers } from './users';

type ThreadMessage = ChatMessage & {
  chatChannelId: number;
};

export const mockThreads: Array<ThreadMessage> = [
  {
    id: 11,
    message: 'Hey',
    cooked: '<p>Hey</p>',
    createdAt: '2025-01-21T07:25:25Z',
    threadId: 1,
    user: {
      id: mockUsers[0].id,
      username: mockUsers[0].username,
      name: mockUsers[0].name,
      avatarTemplate: mockUsers[0].avatarTemplate,
    },
    mentionedUsers: [],
    chatChannelId: 2,
    uploads: [
      {
        id: 110,
      },
    ],
  },
  {
    id: 12,
    message: 'Hello',
    cooked: '<p>Hello</p>',
    createdAt: '2025-01-21T08:25:25Z',
    threadId: 1,
    user: {
      id: mockUsers[1].id,
      username: mockUsers[1].username,
      name: mockUsers[1].name,
      avatarTemplate: mockUsers[1].avatarTemplate,
    },
    mentionedUsers: [],
    uploads: [],
    chatChannelId: 2,
  },

  {
    id: 13,
    message: `mention @${mockUsers[1].username}`,
    cooked: `<p>try to send mention <a class="mention" href="/u/${mockUsers[1].username}">@${mockUsers[1].username}</a></p>`,
    createdAt: '2025-01-22T03:25:25Z',
    threadId: 1,
    user: {
      id: mockUsers[0].id,
      username: mockUsers[0].username,
      name: mockUsers[0].name,
      avatarTemplate: mockUsers[0].avatarTemplate,
    },
    mentionedUsers: [
      {
        id: mockUsers[1].id,
        username: mockUsers[1].username,
        name: mockUsers[1].name,
        avatarTemplate: mockUsers[1].avatarTemplate,
      },
    ],
    uploads: [],
    chatChannelId: 2,
  },
];

export const mockNewThread: ThreadMessage = {
  id: 14,
  message: 'Hey just want to test send this thread',
  cooked: '<p>Hey just want to test send this thread</p>',
  createdAt: '2025-01-22T03:25:25Z',
  threadId: 1,
  user: {
    id: mockUsers[0].id,
    username: mockUsers[0].username,
    name: mockUsers[0].name,
    avatarTemplate: mockUsers[0].avatarTemplate,
  },
  mentionedUsers: [],
  uploads: [],
  chatChannelId: 2,
};

export const mockChatChannelMessages: Array<ChatMessage> = [
  {
    id: 301,
    message: 'This is live chat.',
    cooked: '<p>This is live chat.</p>',
    createdAt: '2025-02-20T05:01:50Z',
    threadId: null,
    mentionedUsers: [],
    uploads: [],
    user: {
      avatarTemplate: mockUsers[0].avatarTemplate,
      id: mockUsers[0].id,
      name: mockUsers[0].name,
      username: mockUsers[0].username,
    },
  },
  {
    id: 302,
    message: 'Try sending a message here.',
    cooked: '<p>Try sending a message here.</p>',
    createdAt: '2025-02-20T05:02:01Z',
    threadId: 1,
    thread: {
      replyCount: mockThreads.length,
    },
    mentionedUsers: [],
    uploads: [],

    user: {
      avatarTemplate: mockUsers[0].avatarTemplate,
      id: mockUsers[0].id,
      name: mockUsers[0].name,
      username: mockUsers[0].username,
    },
  },
];

export const mockNewChat: ChatMessage = {
  id: 303,
  message: "I'm replying.",
  cooked: "<p>I'm replying.</p>",
  createdAt: '2025-02-20T05:03:55Z',
  threadId: null,
  mentionedUsers: [],
  uploads: [],
  user: {
    avatarTemplate: mockUsers[1].avatarTemplate,
    id: mockUsers[1].id,
    name: mockUsers[1].name,
    username: mockUsers[1].username,
  },
};

export const mockChatChannels: Array<Channel> = [
  {
    id: 1,
    chatable: {
      id: 1,
      color: 'E45735',
    },
    title: 'Channel Staff',
    status: 'open',
    membershipsCount: 5,
    currentUserMembership: {
      following: true,
      lastReadMessageId: null,
    },
    meta: {
      canJoinChatChannel: true,
    },
    threadingEnabled: false,
    lastMessage: {
      id: null,
    },
  },
  {
    id: 2,
    chatable: {
      id: 2,
      color: '231F20',
    },
    title: 'Channel Test',
    status: 'open',
    membershipsCount: 8,
    currentUserMembership: {
      following: true,
      lastReadMessageId: null,
    },
    meta: {
      canJoinChatChannel: true,
    },
    threadingEnabled: true,
    lastMessage: {
      id: mockChatChannelMessages[1].id,
    },
  },

  {
    id: 3,
    chatable: {
      id: 2,
      color: '231F20',
    },
    title: 'Channel Not Join',
    status: 'open',
    membershipsCount: 5,
    meta: {
      canJoinChatChannel: true,
    },
    threadingEnabled: false,
    lastMessage: {
      id: null,
    },
  },
  {
    id: 4,
    chatable: {
      id: 2,
      color: '231F20',
    },
    title: 'Channel Closed',
    status: 'closed',
    membershipsCount: 3,
    meta: {
      canJoinChatChannel: true,
    },
    threadingEnabled: false,
    lastMessage: {
      id: null,
    },
  },
];
