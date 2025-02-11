import { mockMessages } from './messages';
import { mockMessageReplies } from './posts';
import { mockUsers } from './users';

export let mockMessageDetails = [
  {
    id: mockMessages[0].id,
    title: 'Testing new message',
    postStream: {
      posts: [mockMessageReplies[0]],
      stream: [mockMessageReplies[0].id],
      firstPost: null,
    },
    details: {
      allowedUsers: mockUsers,
      participants: [mockUsers[1]],
      createdBy: {
        id: mockUsers[1].id,
        username: mockUsers[1].username,
      },
    },
    postsCount: mockMessages[0].postsCount,
  },
];
