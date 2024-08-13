import { mockTopics, mockUsers, mockToken } from '../data';

export const queriesResolvers = {
  Query: {
    about: () => {
      return {
        topicCount: mockTopics.length,
      };
    },
    refreshToken: () => {
      let { id, username, name } = mockUsers[0];

      return {
        token: mockToken,
        id,
        username,
        name,
      };
    },
    health: () => {
      return {
        isDiscourseReachable: true,
        discourseHost: '',
        discourseError: null,
      };
    },
  },
};
