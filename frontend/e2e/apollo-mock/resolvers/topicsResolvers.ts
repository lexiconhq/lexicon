import {
  mockTopics,
  mockUsers,
  mockTopicDetails,
  mockPostsReplies,
  mockMessageReplies,
  mockMessageDetails,
  mockNewTopics,
  mockNewTopicWithPoll,
  mockFirstPost,
  mockPostWithPoll,
  mockSearchTopics,
} from '../data';
import {
  TopicsSortEnum,
  ReplyInput,
  PosterOutputUnion,
  NewTopicInput,
  QuerySearchArgs,
  EditPostInput,
} from '../generated/server';

export const topicResolvers = {
  PosterOutputUnion: {
    __resolveType(obj: PosterOutputUnion) {
      if (obj.hasOwnProperty('userId')) {
        return 'TopicPosterNewUnion';
      }
      return 'SuggestionTopicPoster';
    },
  },
  Query: {
    topics: (
      _: unknown,
      {
        categoryId,
      }: {
        sort: TopicsSortEnum;
        categoryId: number;
        page: number;
        username: string;
      },
    ) => {
      const topics = categoryId
        ? mockTopics.filter((t) => t.categoryId === categoryId)
        : mockTopics;
      const reversedArray = [...topics].reverse();

      return {
        users: mockUsers,
        topicList: {
          tags: null,
          topics: reversedArray,
        },
      };
    },
    topicDetail(
      _: unknown,
      {
        topicId,
      }: {
        topicId: number;
        postIds: Array<number>;
        postNumber: number;
        includeFirstPost: boolean;
      },
    ) {
      let topicDetails = mockTopicDetails.find((t) => t.id === topicId);

      if (!topicDetails) {
        throw new Error('Topic not found');
      }

      return topicDetails;
    },
    postRaw(
      _: unknown,
      __: {
        postId: number;
      },
    ) {
      return {
        raw: mockPostWithPoll.raw,
        markdownContent: mockPostWithPoll.markdownContent,
        mentions: mockPostWithPoll.mentions,
      };
    },
    search: (_: unknown, { search }: QuerySearchArgs) => {
      const indexes: Array<number> = mockSearchTopics.topics.reduce<
        Array<number>
      >((acc, obj, index) => {
        if (obj.title.toLowerCase().includes(search)) {
          acc.push(index);
        }
        return acc;
      }, []);
      const filteredData = {
        posts: mockSearchTopics.posts.filter((_, index) =>
          indexes.includes(index),
        ),
        topics: mockSearchTopics.topics.filter((_, index) =>
          indexes.includes(index),
        ),
      };

      return filteredData;
    },
  },
  Mutation: {
    reply: (_: unknown, { replyInput }: { replyInput: ReplyInput }) => {
      // This condition is for replying to a post.
      let existingTopicDetail = mockTopicDetails.filter(
        (t) => t.id === replyInput.topicId,
      );
      let newPostReply = replyInput.replyToPostNumber
        ? mockPostsReplies[2]
        : mockPostsReplies[1];

      if (existingTopicDetail.length === 1) {
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

        return {
          id: newPostReply.id,
          postNumber: newPostReply.postNumber,
        };
      }

      // This condition is for replying to a message.
      let existingMessageDetail = mockMessageDetails.filter(
        (t) => t.id === replyInput.topicId,
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

        return {
          id: mockMessageReplies[1].id,
          postNumber: mockMessageReplies[1].postNumber,
          userId: mockUsers[0].id,
          createdAt: mockMessageReplies[1].createdAt,
          raw: replyInput.raw,
        };
      }

      throw new Error('Topic id not found');
    },
    newTopic: (
      _: unknown,
      { newTopicInput }: { newTopicInput: NewTopicInput },
    ) => {
      let newTopic = newTopicInput.raw.startsWith('[poll')
        ? mockNewTopicWithPoll
        : mockNewTopics;
      mockTopics.push(newTopic);

      return {
        topicId: newTopic.id,
      };
    },
    editPost: (
      _: unknown,
      { postId, postInput }: { postId: number; postInput: EditPostInput },
    ) => {
      let combinedPost = [mockFirstPost, ...mockPostsReplies];
      let existingPost = combinedPost.find((t) => t.id === postId);
      if (existingPost) {
        existingPost.markdownContent = postInput.raw;

        return {
          id: existingPost.id,
          postNumber: existingPost.postNumber,
        };
      }

      // This condition is for editing poll options
      if (mockPostWithPoll.id === postId) {
        mockPostWithPoll.markdownContent = postInput.raw;
        mockPostWithPoll.polls[0].options = [
          ...mockPostWithPoll.polls[0].options,
          {
            id: '24v7ozi4art46j6ag4oe89u24jkc42v5',
            html: 'Grape',
            votes: 0,
          },
        ];

        return {
          id: mockPostWithPoll.id,
          postNumber: mockPostWithPoll.postNumber,
        };
      }

      throw new Error('Post id not found');
    },
  },
};
