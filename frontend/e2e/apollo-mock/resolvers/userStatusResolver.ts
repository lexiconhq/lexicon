import { mockUsers } from '../data';

export const userStatusResolvers = {
  Mutation: {
    editUserStatus: (
      _: unknown,
      {
        endsAt,
        emoji,
        description,
      }: { endsAt?: string; emoji: string; description: string },
    ) => {
      if (mockUsers[0].status) {
        mockUsers[0].status = {
          ...mockUsers[0].status,
          ...{ emoji, endsAt, description },
        };
      }

      return 'success';
    },
    deleteUserStatus: () => {
      if (mockUsers[0].status) {
        mockUsers[0].status = null;
      }

      return 'success';
    },
  },
};
