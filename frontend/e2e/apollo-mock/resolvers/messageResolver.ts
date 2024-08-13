import { mockNewMessageTopic, mockUsers } from '../data';
import { mockMessageDetails } from '../data/messageDetails';
import { mockMessages, mockNewMessage } from '../data/messages';

export const messageResolvers = {
  Query: {
    privateMessage: (_: unknown, { username }: { username: string }) => {
      if (username) {
        return {
          primaryGroups: [],
          topicList: {
            topics: mockMessages,
          },
          users: mockUsers,
        };
      }
      throw new Error('User not found');
    },
    privateMessageDetail: (
      _: unknown,
      {
        topicId,
      }: {
        topicId: number;
        postIds: Array<number>;
        postNumber: number;
        includeFirstPost: boolean;
      },
    ) => {
      let messageDetails = mockMessageDetails.filter((t) => t.id === topicId);

      if (messageDetails.length === 0) {
        throw new Error('Message not found');
      }

      return messageDetails[0];
    },
  },
  Mutation: {
    newPrivateMessage: (_: unknown) => {
      mockMessages.push(mockNewMessage);

      return {
        id: mockNewMessage.id,
        name: mockNewMessageTopic.posters[0].user.name,
        username: mockNewMessageTopic.posters[0].user.username,
        avatarTemplate: mockNewMessageTopic.posters[0].user.avatarTemplate,
        createdAt: mockNewMessageTopic.createdAt,
        raw: mockNewMessageTopic.excerpt,
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
      };
    },
    leaveMessage: (_: unknown, { topicId }: { topicId: number }) => {
      const indexToRemove = mockMessages.findIndex(({ id }) => id === topicId);

      if (indexToRemove !== -1) {
        mockMessages.splice(indexToRemove, 1);
      }

      return 'success';
    },
  },
};
