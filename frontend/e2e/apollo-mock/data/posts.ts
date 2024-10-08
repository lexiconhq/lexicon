import { mockMessages } from './messages';
import { mockNewTopicWithPoll, mockTopics } from './topics';
import { mockUsers } from './users';

export const mockPostsReplies = [
  {
    id: 4,
    topicId: mockTopics[2].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    avatarTemplate: mockUsers[0].avatarTemplate,
    hidden: false,
    canEdit: true,
    markdownContent: 'Just want to reply in here',
    mentions: null,
    createdAt: '2023-07-13T07:40:18.723Z',
    updatedAt: '2023-07-13T07:40:18.723Z',
    replyCount: 0,
    actionsSummary: [
      {
        id: 2,
        count: null,
        acted: null,
      },
      {
        id: 3,
        count: null,
        acted: null,
      },
      {
        id: 4,
        count: null,
        acted: null,
      },
      {
        id: 8,
        count: null,
        acted: null,
      },
      {
        id: 6,
        count: null,
        acted: null,
      },
      {
        id: 7,
        count: null,
        acted: null,
      },
    ],
    postNumber: mockTopics[2].postsCount,
    replyToPostNumber: null,
    userStatus: mockUsers[0].status,
  },
  {
    id: 5,
    topicId: mockTopics[2].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    avatarTemplate: mockUsers[0].avatarTemplate,
    hidden: false,
    canEdit: true,
    markdownContent: 'Sending a reply. [test url](https://www.google.com)',
    mentions: null,
    createdAt: '2023-07-13T07:40:18.723Z',
    replyCount: 0,
    actionsSummary: [
      {
        id: 2,
        count: null,
        acted: null,
      },
      {
        id: 3,
        count: null,
        acted: null,
      },
      {
        id: 4,
        count: null,
        acted: null,
      },
      {
        id: 8,
        count: null,
        acted: null,
      },
      {
        id: 6,
        count: null,
        acted: null,
      },
      {
        id: 7,
        count: null,
        acted: null,
      },
    ],
    postNumber: mockTopics[2].postsCount + 1,
    replyToPostNumber: null,
    userStatus: mockUsers[0].status,
  },
  {
    id: 13,
    topicId: mockTopics[2].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    avatarTemplate: mockUsers[0].avatarTemplate,
    hidden: false,
    canEdit: true,
    markdownContent: 'This is a quote reply.',
    mentions: null,
    createdAt: '2023-07-13T07:40:18.723Z',
    replyCount: 0,
    actionsSummary: [
      {
        id: 2,
        count: null,
        acted: null,
      },
      {
        id: 3,
        count: null,
        acted: null,
      },
      {
        id: 4,
        count: null,
        acted: null,
      },
      {
        id: 8,
        count: null,
        acted: null,
      },
      {
        id: 6,
        count: null,
        acted: null,
      },
      {
        id: 7,
        count: null,
        acted: null,
      },
    ],
    postNumber: mockTopics[2].postsCount + 2,
    replyToPostNumber: mockTopics[2].postsCount,
    userStatus: mockUsers[0].status,
  },
];

export const mockMessageReplies = [
  {
    id: 7,
    topicId: mockMessages[0].id,
    username: mockUsers[1].username,
    actionCode: null,
    actionCodeWho: null,
    markdownContent: 'Testing new message push.',
    mentions: null,
    createdAt: '2023-05-23T05:23:16.062Z',
    postNumber: 1,
  },
  {
    id: 8,
    topicId: mockMessages[0].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    markdownContent: 'Test sending a reply.',
    mentions: null,
    createdAt: '2023-05-24T05:23:16.062Z',
    postNumber: 2,
  },
  {
    id: 9,
    topicId: mockMessages[0].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    markdownContent: '[test url](https://www.google.com)',
    mentions: null,
    createdAt: '2023-05-24T05:23:16.062Z',
    postNumber: 2,
  },
];

export const mockFirstPost = {
  id: 3,
  topicId: mockTopics[2].id,
  username: mockUsers[0].username,
  actionCode: null,
  actionCodeWho: null,
  avatarTemplate: mockUsers[0].avatarTemplate,
  hidden: false,
  canEdit: true,
  markdownContent: mockTopics[2].excerpt,
  mentions: [],
  createdAt: mockTopics[2].createdAt,
  replyCount: mockTopics[2].replyCount,
  postNumber: 1,
  replyToPostNumber: null,
  userStatus: mockUsers[0].status,
  actionsSummary: mockPostsReplies[0].actionsSummary,
};

export const mockPostWithPoll = {
  id: 12,
  topicId: mockNewTopicWithPoll.id,
  username: mockUsers[0].username,
  actionCode: null,
  actionCodeWho: null,
  avatarTemplate: mockUsers[0].avatarTemplate,
  hidden: false,
  canEdit: true,
  raw: '[poll type=regular results=always public=true chartType=bar]\n# Favorite Fruit\n* Banana\n* Apple\n* Mango\n[/poll]',
  markdownContent:
    '[poll type=regular results=always public=true chartType=bar]\n# Favorite Fruit\n* Banana\n* Apple\n* Mango\n[/poll]',
  mentions: [],
  createdAt: '2023-07-13T07:40:18.723Z',
  updatedAt: '2023-07-13T07:40:18.723Z',
  replyCount: 0,
  actionsSummary: [
    {
      id: 2,
      count: null,
      acted: null,
    },
    {
      id: 3,
      count: null,
      acted: null,
    },
    {
      id: 4,
      count: null,
      acted: null,
    },
    {
      id: 8,
      count: null,
      acted: null,
    },
    {
      id: 6,
      count: null,
      acted: null,
    },
    {
      id: 7,
      count: null,
      acted: null,
    },
  ],
  postNumber: mockNewTopicWithPoll.postsCount,
  replyToPostNumber: null,
  polls: [
    {
      name: 'poll',
      type: 'regular',
      status: 'open',
      results: 'always',
      options: [
        {
          id: 'fd10f08e2f91c68a6489a4f0d475cea2',
          html: 'Banana',
          votes: 0,
        },
        {
          id: '4341f33f3bc598443053955f68b9a24f',
          html: 'Apple',
          votes: 0,
        },
        {
          id: '9414c67b0ad5577e3121a5e56f7a0176',
          html: 'Mango',
          votes: 0,
        },
      ],
      voters: 0,
      chartType: 'bar',
      title: 'Favorite Fruit',
      groups: null,
      public: true,
      min: null,
      max: null,
      close: null,
      step: null,
      preloadedVoters: [],
    },
  ],
  pollsVotes: null,
};

export const allPosts = [...mockPostsReplies, mockFirstPost, mockPostWithPoll];
