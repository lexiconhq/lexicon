import { mockCategories } from './categories';
import { mockUsers } from './users';

export const mockTopics = [
  {
    id: 1,
    title: 'Welcome to Lexicon Lounge',
    imageUrl: null,
    postsCount: 1,
    replyCount: 0,
    createdAt: '2023-01-05T15:55:22.000Z',
    bumpedAt: '2023-01-05T15:55:22.000Z',
    excerpt:
      'Welcome to the Lounge\n\nA community for technical discussions and Q&A related to software engineering and technology in general. \n\nThis is a Civilized Place for Public Discussion\n\nPlease treat this discussion forum with&hellip;',
    visible: true,
    liked: false,
    tags: [],
    views: 15,
    likeCount: 0,
    categoryId: mockCategories[0].id,
    posters: [
      {
        userId: mockUsers[0].id,
        description: 'Original Poster, Most Recent Poster',
        user: mockUsers[0],
      },
    ],
    postersUnion: [
      {
        userId: mockUsers[0].id,
        description: 'Original Poster, Most Recent Poster',
        user: mockUsers[0],
      },
    ],
    authorUserId: mockUsers[0].id,
    frequentPosterUserId: null,
    pinned: true,
  },
  {
    id: 2,
    title: 'Hotel or resort in Ubud',
    imageUrl: null,
    postsCount: 2,
    replyCount: 0,
    createdAt: '2023-05-11T04:55:20.324Z',
    bumpedAt: '2023-05-24T09:58:23.020Z',
    excerpt:
      'Do you guys have any preference hotel or resort or villa in Ubud? with a cheap prive ofc',
    visible: true,
    liked: false,
    tags: [],
    views: 11,
    likeCount: 1,
    categoryId: mockCategories[0].id,
    posters: [
      {
        userId: mockUsers[1].id,
        description: 'Original Poster',
        user: mockUsers[1],
      },
      {
        userId: mockUsers[0].id,
        description: 'Most Recent Poster',
        user: mockUsers[0],
      },
    ],
    postersUnion: [
      {
        userId: mockUsers[1].id,
        description: 'Original Poster',
        user: mockUsers[1],
      },
      {
        userId: mockUsers[0].id,
        description: 'Most Recent Poster',
        user: mockUsers[0],
      },
    ],
    authorUserId: mockUsers[0].id,
    frequentPosterUserId: null,
    pinned: false,
  },
  {
    id: 3,
    title: 'Detox Test',
    imageUrl: null,
    postsCount: 2,
    replyCount: 0,
    createdAt: '2023-07-10T09:41:35.301Z',
    bumpedAt: '2023-07-10T19:29:25.000Z',
    excerpt: 'For testing Detox',
    visible: true,
    liked: false,
    tags: [],
    views: 2,
    likeCount: 0,
    categoryId: mockCategories[1].id,
    posters: [
      {
        userId: mockUsers[0].id,
        description: 'Original Poster, Most Recent Poster',
        user: mockUsers[0],
      },
    ],
    postersUnion: [
      {
        userId: mockUsers[0].id,
        description: 'Original Poster, Most Recent Poster',
        user: mockUsers[0],
      },
    ],
    authorUserId: mockUsers[0].id,
    frequentPosterUserId: null,
    pinned: false,
  },
];

export const mockNewTopics = {
  id: 9,
  title: 'Creating a New Post',
  imageUrl: null,
  postsCount: 1,
  replyCount: 0,
  createdAt: '2023-07-10T09:41:35.301Z',
  bumpedAt: '2023-07-10T19:29:25.000Z',
  excerpt: 'Adding a content to the new post.',
  visible: true,
  liked: false,
  tags: [],
  views: 2,
  likeCount: 0,
  categoryId: mockCategories[1].id,
  posters: [
    {
      userId: mockUsers[0].id,
      description: 'Original Poster, Most Recent Poster',
      user: mockUsers[0],
    },
  ],
  postersUnion: [
    {
      userId: mockUsers[0].id,
      description: 'Original Poster, Most Recent Poster',
      user: mockUsers[0],
    },
  ],
  authorUserId: mockUsers[0].id,
  frequentPosterUserId: null,
  pinned: false,
};

export const mockNewMessageTopic = {
  id: 10,
  title: 'Send a new message',
  imageUrl: null,
  postsCount: 1,
  replyCount: 0,
  createdAt: '2023-09-11T02:30:02.637Z',
  bumpedAt: '2023-09-11T02:30:02.637Z',
  excerpt: 'I am sending this message to you.',
  visible: true,
  liked: false,
  tags: [],
  views: 1,
  likeCount: 0,
  categoryId: null,
  posters: [
    {
      userId: mockUsers[0].id,
      description: 'Original Poster, Most Recent Poster',
      user: mockUsers[0],
    },
  ],
  postersUnion: [
    {
      userId: mockUsers[0].id,
      description: 'Original Poster, Most Recent Poster',
      user: mockUsers[0],
    },
  ],
  authorUserId: mockUsers[0].id,
  frequentPosterUserId: null,
  pinned: false,
};

export const mockNewTopicWithPoll = {
  id: 11,
  title: 'New Post with Poll',
  imageUrl: null,
  postsCount: 1,
  replyCount: 0,
  createdAt: '2023-07-11T09:41:35.301Z',
  bumpedAt: '2023-07-11T19:29:25.000Z',
  excerpt: 'poll',
  visible: true,
  liked: false,
  tags: [],
  views: 2,
  likeCount: 0,
  categoryId: mockCategories[1].id,
  posters: [
    {
      userId: mockUsers[0].id,
      description: 'Original Poster, Most Recent Poster',
      user: mockUsers[0],
    },
  ],
  postersUnion: [
    {
      userId: mockUsers[0].id,
      description: 'Original Poster, Most Recent Poster',
      user: mockUsers[0],
    },
  ],
  authorUserId: mockUsers[0].id,
  frequentPosterUserId: null,
  pinned: false,
};

export const mockSearchTopics = {
  posts: [
    {
      id: 12,
      username: mockUsers[0].username,
      avatarTemplate: mockUsers[0].avatarTemplate,
      createdAt: mockTopics[0].createdAt,
      likeCount: mockTopics[0].likeCount,
      blurb:
        '#welcome Welcome to Lounge A community for technical discussions and Q &amp; A related to software engineering and technology in general. #civilized This is a...',
      postNumber: 1,
      topicId: mockTopics[0].id,
    },
    {
      id: 13,
      username: mockUsers[0].username,
      avatarTemplate: mockUsers[0].avatarTemplate,
      createdAt: mockTopics[1].createdAt,
      likeCount: mockTopics[1].likeCount,
      blurb: mockTopics[1].excerpt,
      postNumber: 1,
      topicId: mockTopics[1].id,
    },
    {
      id: '3',
      username: mockUsers[0].username,
      avatarTemplate: mockUsers[0].avatarTemplate,
      createdAt: mockTopics[2].createdAt,
      likeCount: mockTopics[2].likeCount,
      blurb: mockTopics[2].excerpt,
      postNumber: 1,
      topicId: mockTopics[2].id,
    },
  ],
  topics: [
    {
      ...mockTopics[0],
      archetype: 'regular',
    },
    {
      ...mockTopics[1],
      archetype: 'regular',
    },
    {
      ...mockTopics[2],
      archetype: 'regular',
    },
  ],
};

export const allTopics = [...mockTopics, mockNewTopics, mockNewTopicWithPoll];
