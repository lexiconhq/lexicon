import {
  mockFirstPost,
  mockPostWithCollapsible,
  mockPostWithPoll,
  mockPostsReplies,
} from './posts';
import {
  mockNewTopicWithCollapsible,
  mockNewTopicWithPoll,
  mockTopicsRest,
} from './topics';
import { mockUsers } from './users';

export let mockTopicDetailsRest = [
  {
    id: mockTopicsRest[2].id,
    title: mockTopicsRest[2].title,
    views: mockTopicsRest[2].views,
    likeCount: mockTopicsRest[2].likeCount,
    postsCount: mockTopicsRest[2].postsCount,
    liked: mockTopicsRest[2].liked,
    categoryId: mockTopicsRest[2].categoryId,
    tags: mockTopicsRest[2].tags,
    createdAt: mockTopicsRest[2].createdAt,
    postStream: {
      posts: [mockFirstPost, mockPostsReplies[0]],
      stream: [mockFirstPost.id, mockPostsReplies[0].id],
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
      posts: [mockPostWithPoll],
      stream: [mockPostWithPoll.id],
    },
    details: {
      canEdit: true,
      allowedUsers: null,
      participants: [mockUsers[0]],
    },
  },
  {
    id: mockNewTopicWithCollapsible.id,
    title: mockNewTopicWithCollapsible.title,
    views: mockNewTopicWithCollapsible.views,
    likeCount: mockNewTopicWithCollapsible.likeCount,
    postsCount: mockNewTopicWithCollapsible.postsCount,
    liked: mockNewTopicWithCollapsible.liked,
    categoryId: mockNewTopicWithCollapsible.categoryId,
    tags: mockNewTopicWithCollapsible.tags,
    createdAt: mockNewTopicWithCollapsible.createdAt,
    postStream: {
      posts: [mockPostWithCollapsible],
      stream: [mockPostWithCollapsible.id],
    },
    details: {
      canEdit: true,
      allowedUsers: null,
      participants: [mockUsers[0]],
    },
  },
];
