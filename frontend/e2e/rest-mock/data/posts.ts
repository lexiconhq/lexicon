import { mockMessages } from './messages';
import { mockNewTopicWithPoll, mockTopicsRest } from './topics';
import { mockUsers } from './users';

export const mockPostsReplies = [
  {
    id: 4,
    topicId: mockTopicsRest[2].id,
    username: mockUsers[0].username,
    avatarTemplate: mockUsers[0].avatarTemplate,
    hidden: false,
    canEdit: true,
    raw: 'Just want to reply in here',
    cooked: '<p>Just want to reply in here</p>',
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
    postNumber: mockTopicsRest[2].postsCount,
    replyToPostNumber: null,
    userStatus: mockUsers[0].status,
  },
  {
    id: 5,
    topicId: mockTopicsRest[2].id,
    username: mockUsers[0].username,
    avatarTemplate: mockUsers[0].avatarTemplate,
    hidden: false,
    canEdit: true,
    raw: 'Sending a reply. [test url](https://www.google.com)',
    cooked:
      '<p>Sending a reply. <a href="https://www.google.com">test url</a></p>',
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
    postNumber: mockTopicsRest[2].postsCount + 1,
    replyToPostNumber: null,
    userStatus: mockUsers[0].status,
  },
  {
    id: 13,
    topicId: mockTopicsRest[2].id,
    username: mockUsers[0].username,
    avatarTemplate: mockUsers[0].avatarTemplate,
    hidden: false,
    canEdit: true,
    cooked: '<p>This is a quote reply.</p>',
    raw: 'This is a quote reply.',
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
    postNumber: mockTopicsRest[2].postsCount + 2,
    replyToPostNumber: mockTopicsRest[2].postsCount,
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
    mentions: null,
    raw: 'Testing new message push.',
    cooked: '<p>Testing new message push.</p>',
    createdAt: '2023-05-23T05:23:16.062Z',
    postNumber: 1,
    markdownContent: 'Testing new message push.',
  },
  {
    id: 8,
    topicId: mockMessages[0].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    raw: 'Test sending a reply.',
    cooked: '<p>Test sending a reply.</p>',
    mentions: null,
    createdAt: '2023-05-24T05:23:16.062Z',
    postNumber: 2,
    markdownContent: 'Test sending a reply.',
  },
  {
    id: 9,
    topicId: mockMessages[0].id,
    username: mockUsers[0].username,
    actionCode: null,
    actionCodeWho: null,
    raw: '[test url](https://www.google.com)',
    cooked: '<p><a href="https://www.google.com">test url</a></p>',
    mentions: null,
    createdAt: '2023-05-24T05:23:16.062Z',
    postNumber: 2,
    markdownContent: '[test url](https://www.google.com)',
  },
];

export const mockFirstPost = {
  id: 3,
  topicId: mockTopicsRest[2].id,
  username: mockUsers[0].username,
  avatarTemplate: mockUsers[0].avatarTemplate,
  hidden: false,
  canEdit: true,
  createdAt: mockTopicsRest[2].createdAt,
  replyCount: mockTopicsRest[2].replyCount,
  postNumber: 1,
  replyToPostNumber: null,
  userStatus: mockUsers[0].status,
  actionsSummary: mockPostsReplies[0].actionsSummary,
  cooked: `<p>${mockTopicsRest[2].excerpt}</p>`,
  raw: mockTopicsRest[2].excerpt,
};

export const mockPostWithPoll = {
  id: 12,
  topicId: mockNewTopicWithPoll.id,
  username: mockUsers[0].username,
  avatarTemplate: mockUsers[0].avatarTemplate,
  hidden: false,
  canEdit: true,
  cooked: `<div class="poll" data-poll-charttype="bar" data-poll-name="poll" data-poll-public="true" data-poll-results="always" data-poll-status="open" data-poll-type="regular">
<div class="poll-container">
<div class="poll-title">Favorite Fruit</div>
<ul>
<li data-poll-option-id="fd10f08e2f91c68a6489a4f0d475cea2">Banana</li>
<li data-poll-option-id="4341f33f3bc598443053955f68b9a24f">Apple</li>
<li data-poll-option-id="9414c67b0ad5577e3121a5e56f7a0176">Mango</li>
</ul>
</div>
<div class="poll-info">
<div class="poll-info_counts">
<div class="poll-info_counts-count">
<span class="info-number">0</span>
<span class="info-label">voters</span>
</div>
</div>
</div>
</div>`,
  raw: '[poll type=regular results=always public=true chartType=bar]\n# Favorite Fruit\n* Banana\n* Apple\n* Mango\n[/poll]',
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
      public: true,
    },
  ],
  userStatus: mockUsers[0].status,
};

export const allPosts = [...mockPostsReplies, mockFirstPost, mockPostWithPoll];

export const cookedPollEdit = `<div class="poll" data-poll-charttype="bar" data-poll-name="poll" data-poll-public="true" data-poll-results="always" data-poll-status="open" data-poll-type="regular">
<div class="poll-container">
<div class="poll-title">Favorite Fruit</div>
<ul>
<li data-poll-option-id="fd10f08e2f91c68a6489a4f0d475cea2">Banana</li>
<li data-poll-option-id="4341f33f3bc598443053955f68b9a24f">Apple</li>
<li data-poll-option-id="9414c67b0ad5577e3121a5e56f7a0176">Mango</li>
<li data-poll-option-id="28f8c5760a29698e8903821871648b83">Grape</li>
</ul>
</div>
<div class="poll-info">
<div class="poll-info_counts">
<div class="poll-info_counts-count">
<span class="info-number">0</span>
<span class="info-label">voters</span>
</div>
</div>
</div>
</div>`;
