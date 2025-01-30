import { http, HttpResponse } from 'msw';

import {
  EditPostInput,
  EditTopicInput,
} from '../../../src/generatedAPI/server';
import {
  cookedPollEdit,
  mockFirstPost,
  mockMessageDetails,
  mockMessageReplies,
  mockMessages,
  mockNewMessage,
  mockNewMessageTopic,
  mockNewTopics,
  mockNewTopicWithPoll,
  mockPostsReplies,
  mockPostWithPoll,
  mockSearchTopics,
  mockTopicDetailsRest,
  mockTopicsRest,
  mockUsers,
} from '../data';
import { KeysToSnakeCase } from '../utils';

import { parseStringIntoNumber } from './helper';

type topicIdParam = {
  topicId: string;
};

type categoryIdParam = {
  categoryId: string;
};

type postIdParam = {
  postId: string;
};

type CreatePostInput = {
  category?: number;
  raw: string;
  targetRecipients: Array<string>;
  title?: string;
  archetype?: string;
  replyToPostNumber?: number;
  topicId?: number;
  tags?: Array<string>;
};

export const topicsHandler = [
  // Get latest topics list default home
  http.get('/latest.json', () => {
    return HttpResponse.json({
      users: mockUsers.map((user) => {
        return {
          id: user.id,
          avatarTemplate: user.avatarTemplate,
          name: user.name,
          username: user.username,
        };
      }),
      topicList: {
        tags: null,
        topics: mockTopicsRest.reverse(),
      },
    });
  }),

  // Get latest topics list by filter channel
  http.get<categoryIdParam>('/c/:categoryId/l/latest.json', (req) => {
    const { categoryId } = req.params;

    const parseCategoryId = parseStringIntoNumber(categoryId);
    if (!parseCategoryId) {
      throw new Error('provide category id');
    }
    const topics = mockTopicsRest.filter(
      (t) => t.categoryId === parseCategoryId,
    );
    return HttpResponse.json({
      users: mockUsers.map((user) => {
        return {
          id: user.id,
          avatarTemplate: user.avatarTemplate,
          name: user.name,
          username: user.username,
        };
      }),
      topicList: {
        tags: null,
        topics: topics.reverse(),
      },
    });
  }),

  // topic detail
  http.get<topicIdParam>('/t/:topicId.json', (req) => {
    const { topicId } = req.params;

    const parseTopicId = parseStringIntoNumber(topicId);
    if (!parseTopicId) {
      throw new Error('provide topic id');
    }
    let topicDetails = mockTopicDetailsRest.find((t) => t.id === parseTopicId);
    if (topicDetails) {
      return HttpResponse.json({
        ...topicDetails,
      });
    }

    throw new Error('Topic not found');
  }),

  // Topic or message detail with post number
  http.get<topicIdParam & { postNumber: string }>(
    `/t/:topicId/:postNumber.json`,
    (req) => {
      const { topicId } = req.params;
      const parseTopicId = parseStringIntoNumber(topicId);
      if (!parseTopicId) {
        throw new Error('provide topic id');
      }

      // Topic detail
      let topicDetails = mockTopicDetailsRest.find(
        (t) => t.id === parseTopicId,
      );
      if (topicDetails) {
        return HttpResponse.json({
          ...topicDetails,
        });
      }

      // Message detail
      let messageDetails = mockMessageDetails.find(
        (t) => t.id === parseTopicId,
      );
      if (messageDetails) {
        return HttpResponse.json({
          ...messageDetails,
        });
      }

      throw new Error('Topic not found');
    },
  ),

  // post raw
  http.get('/posts/:postId/raw.json', () => {
    return HttpResponse.text(mockPostWithPoll.raw);
  }),

  // post cooked
  http.get('/posts/:postId/cooked.json', () => {
    return HttpResponse.text(mockPostWithPoll.cooked);
  }),

  // search post
  http.get('/search.json', (req) => {
    let uri = new URL(req.request.url);
    const q = uri.searchParams.get('q') || '';
    // split q value to only get search value because when search it show order value example "q=welcome+order:latest"
    const search = q.split('order:')[0].replace(/\+/g, ' ') || '';

    const indexes: Array<number> = mockSearchTopics.topics.reduce<
      Array<number>
    >((acc, obj, index) => {
      if (obj.title.toLowerCase().includes(search)) {
        acc.push(index);
      }
      return acc;
    }, []);

    return HttpResponse.json({
      topics: mockSearchTopics.topics.filter((_, index) =>
        indexes.includes(index),
      ),
      posts: mockSearchTopics.posts.filter((_, index) =>
        indexes.includes(index),
      ),
    });
  }),

  // new topic
  http.post<never, KeysToSnakeCase<CreatePostInput>>(
    '/posts.json',
    async (req) => {
      const reqBody = await req.request.json();
      let response = null;

      // This condition is for creating new message
      if ('target_recipients' in reqBody && 'title' in reqBody) {
        mockMessages.push(mockNewMessage);

        response = {
          id: mockNewMessage.id,
          name: mockNewMessageTopic.posters[0].user.name,
          username: mockNewMessageTopic.posters[0].user.username,
          avatarTemplate: mockNewMessageTopic.posters[0].user.avatarTemplate,
          createdAt: mockNewMessageTopic.createdAt,
          raw: mockNewMessageTopic.raw,
          cooked: mockNewMessageTopic.cooked,
          postNumber: 1,
          postType: 1,
          replyCount: 0,
          replyToPostNumber: null,
          topicId: mockNewMessageTopic.id,
          displayUsername: mockNewMessageTopic.posters[0].user.name,
          canEdit: true,
          moderator: false,
          admin: false,
          staff: false,
          userId: mockNewMessageTopic.posters[0].user.id,
          actionsSummary: [
            { acted: true, count: null, id: 2 },
            { acted: true, count: null, id: 6 },
            { acted: true, count: null, id: 3 },
            { acted: true, count: null, id: 4 },
            { acted: true, count: null, id: 8 },
            { acted: true, count: null, id: 10 },
            { acted: true, count: null, id: 7 },
          ],
        };
      }
      // This condition is for replying to a message.
      else if ('topic_id' in reqBody) {
        const { topic_id, raw, reply_to_post_number } = reqBody;

        let existingMessageDetail = mockMessageDetails.filter(
          (t) => t.id === topic_id,
        );

        if (existingMessageDetail.length === 1) {
          const lengthPostStreamMessage =
            existingMessageDetail[0].postStream.stream.length;

          let newPostStreams = [
            ...existingMessageDetail[0].postStream.stream,
            mockMessageReplies[lengthPostStreamMessage].id,
          ];
          let newPosts = [
            ...existingMessageDetail[0].postStream.posts,
            mockMessageReplies[lengthPostStreamMessage],
          ];
          existingMessageDetail[0].postStream.stream = newPostStreams;
          existingMessageDetail[0].postStream.posts = newPosts;

          response = {
            id: mockMessageReplies[1].id,
            postNumber: mockMessageReplies[1].postNumber,
            userId: mockUsers[0].id,
            createdAt: mockMessageReplies[1].createdAt,
            raw,
            cooked: `<p>${raw}</p>`,
          };
        }

        let existingTopicDetail = mockTopicDetailsRest.filter(
          (t) => t.id === topic_id,
        );

        if (existingTopicDetail.length === 1) {
          let newPostReply = reply_to_post_number
            ? mockPostsReplies[2]
            : mockPostsReplies[1];
          let newPostStreams = [
            ...existingTopicDetail[0].postStream.stream,
            newPostReply.id,
          ];
          let newPosts = [
            ...existingTopicDetail[0].postStream.posts,
            newPostReply,
          ];
          existingTopicDetail[0].postStream.stream = newPostStreams;
          existingTopicDetail[0].postStream.posts = newPosts;

          response = {
            id: newPostReply.id,
            postNumber: newPostReply.postNumber,
            userId: mockUsers[0].id,
            createdAt: newPostReply.createdAt,
            raw,
            cooked: `<p>${raw}</p>`,
          };
        }
      }
      // This condition is for creating new topic.
      else if ('raw' in reqBody) {
        const { raw } = reqBody;

        let newTopic = raw.startsWith('[poll')
          ? mockNewTopicWithPoll
          : mockNewTopics;
        mockTopicsRest.push(newTopic);

        // For response it only use topicId at app
        response = {
          ...newTopic,
          topicId: newTopic.id,
          avatarTemplate: mockUsers[0].avatarTemplate,
          cooked: `<p>${newTopic.excerpt}</p>`,
          raw: newTopic.excerpt,
        };
      }

      return HttpResponse.json(response);
    },
  ),
  // edit topic
  http.put<topicIdParam, KeysToSnakeCase<EditTopicInput>>(
    '/t/-/:topicId.json',
    async (req) => {
      const { topicId } = req.params;
      const parseTopicId = parseStringIntoNumber(topicId);
      if (!parseTopicId) {
        throw new Error('provide topic id');
      }
      let existingTopic = mockTopicsRest.find((t) => t.id === parseTopicId);
      if (!existingTopic) {
        throw new Error('Topic not found');
      }
      const { title } = await req.request.json();
      if (title) {
        existingTopic.title = title;
      }
      return HttpResponse.json({
        basicTopic: {
          id: existingTopic.id,
          title: existingTopic.title,
        },
      });
    },
  ),

  // edit post
  http.put<postIdParam, KeysToSnakeCase<EditPostInput>>(
    '/posts/:postId.json',
    async (req) => {
      const { postId } = req.params;
      const parsePostId = parseStringIntoNumber(postId);
      const {
        post: { raw },
      } = await req.request.json();
      if (!parsePostId) {
        throw new Error('provide post id');
      }
      let combinedPost = [mockFirstPost, ...mockPostsReplies];
      let existingPost = combinedPost.find((t) => t.id === parsePostId);
      if (existingPost) {
        if (raw) {
          existingPost.raw = raw;
          existingPost.cooked = `<p>${raw}</p>`;
        }
        return HttpResponse.json({
          post: {
            id: existingPost.id,
            postNumber: existingPost.postNumber,
          },
        });
      }

      if (mockPostWithPoll.id === parsePostId) {
        if (raw) {
          mockPostWithPoll.raw = raw;
          mockPostWithPoll.cooked = cookedPollEdit;
          mockPostWithPoll.polls[0].options = [
            ...mockPostWithPoll.polls[0].options,
            {
              id: '24v7ozi4art46j6ag4oe89u24jkc42v5',
              html: 'Grape',
              votes: 0,
            },
          ];
        }
        return HttpResponse.json({
          post: {
            id: mockPostWithPoll.id,
            postNumber: mockPostWithPoll.postNumber,
          },
        });
      }
      throw new Error('Post id not found');
    },
  ),
];
