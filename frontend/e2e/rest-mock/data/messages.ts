import { mockNewMessageTopic } from './topics';
import { mockUsers } from './users';

export const mockMessages = [
  {
    id: 6,
    title: 'Testing new message',
    unseen: false,
    allowedUserCount: 2,
    highestPostNumber: 1,
    lastReadPostNumber: 1,
    lastPostedAt: '2023-05-23T05:23:16.062Z',
    lastPosterUsername: mockUsers[1].username,
    participants: [
      {
        userId: mockUsers[1].id,
        extras: 'latest',
      },
    ],
    posters: [
      {
        userId: mockUsers[1].id,
        extras: 'latest',
      },
    ],
    postsCount: 1,
  },
];

export const mockNewMessage = {
  id: 11,
  title: mockNewMessageTopic.title,
  unseen: false,
  allowedUserCount: 2,
  highestPostNumber: 1,
  lastReadPostNumber: 1,
  lastPostedAt: mockNewMessageTopic.createdAt,
  lastPosterUsername: mockUsers[0].username,
  participants: [
    {
      userId: mockUsers[1].id,
      extras: 'latest',
    },
  ],
  posters: [
    {
      userId: mockUsers[1].id,
      extras: 'latest',
    },
  ],
  postsCount: mockNewMessageTopic.postsCount,
};
