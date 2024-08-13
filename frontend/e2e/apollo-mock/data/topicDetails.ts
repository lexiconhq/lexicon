import { mockFirstPost, mockPostWithPoll, mockPostsReplies } from './posts';
import { mockNewTopicWithPoll, mockNewTopics, mockTopics } from './topics';
import { mockUsers } from './users';

export let mockTopicDetails = [
  {
    id: mockTopics[2].id,
    title: mockTopics[2].title,
    views: mockTopics[2].views,
    likeCount: mockTopics[2].likeCount,
    postsCount: mockTopics[2].postsCount,
    liked: mockTopics[2].liked,
    categoryId: mockTopics[2].categoryId,
    tags: mockTopics[2].tags,
    createdAt: mockTopics[2].createdAt,
    postStream: {
      posts: [mockPostsReplies[0]],
      stream: [mockPostsReplies[0].id],
      firstPost: mockFirstPost,
    },
    details: {
      canEdit: true,
      allowedUsers: null,
      participants: [mockUsers[0]],
    },
  },
  {
    id: mockNewTopics.id,
    title: mockNewTopics.title,
    views: mockNewTopics.views,
    likeCount: mockNewTopics.likeCount,
    postsCount: mockNewTopics.postsCount,
    liked: mockNewTopics.liked,
    categoryId: mockNewTopics.categoryId,
    tags: mockNewTopics.tags,
    createdAt: mockNewTopics.createdAt,
    postStream: {
      posts: [],
      stream: [],
      firstPost: null,
    },
    details: {
      canEdit: true,
      allowedUsers: null,
      participants: [mockUsers[0]],
    },
  },
  {
    id: mockNewTopicWithPoll.id,
    title: mockNewTopicWithPoll.title,
    views: mockNewTopicWithPoll.views,
    likeCount: mockNewTopicWithPoll.likeCount,
    postsCount: mockNewTopicWithPoll.postsCount,
    liked: mockNewTopicWithPoll.liked,
    categoryId: mockNewTopicWithPoll.categoryId,
    tags: mockNewTopicWithPoll.tags,
    createdAt: mockNewTopicWithPoll.createdAt,
    postStream: {
      posts: [],
      stream: [mockPostWithPoll.id],
      firstPost: mockPostWithPoll,
    },
    details: {
      canEdit: true,
      allowedUsers: null,
      participants: [mockUsers[0]],
    },
  },
];
