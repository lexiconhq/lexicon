import { mockUsers } from '../data';

export const userResolvers = {
  Query: {
    searchUser: (_: unknown) => {
      return {
        users: mockUsers,
      };
    },
  },
};
