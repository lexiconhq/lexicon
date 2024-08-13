import { mockUsers } from '../data';
import { EditProfileInput, UserUnion } from '../generated/server';

export const profileResolvers = {
  UserUnion: {
    __resolveType(obj: UserUnion) {
      if ('email' in obj) {
        return 'UserDetail';
      }
      return 'UserLite';
    },
  },
  Query: {
    userProfile: (_: unknown, { username }: { username: string }) => {
      if (username) {
        return {
          unreadNotification: true,
          user: {
            __typename: 'UserDetail',
            avatarTemplate: mockUsers[0].avatarTemplate,
            username: mockUsers[0].username,
            name: mockUsers[0].name,
            websiteName: null,
            bioRaw: null,
            location: null,
            dateOfBirth: null,
            email: 'johndoe@test.com',
            secondaryEmails: [],
            unconfirmedEmails: [],
            canEditUsername: true,
            admin: true,
            status: mockUsers[0].status,
          },
        };
      }
    },
  },
  Mutation: {
    editProfile: (
      _: unknown,
      {
        username,
        newUsername,
      }: {
        username: string;
        editProfileInput: EditProfileInput;
        newUsername: string;
        uploadId: number;
      },
    ) => {
      if (username) {
        return {
          unreadNotification: true,
          id: mockUsers[0].id,
          avatarTemplate: mockUsers[0].avatarTemplate,
          username: newUsername,
          name: mockUsers[0].name,
          websiteName: null,
          bioRaw: null,
          location: null,
          dateOfBirth: null,
          email: 'johndoe@test.com',
          secondaryEmails: [],
          unconfirmedEmails: [],
          canEditUsername: true,
          admin: true,
        };
      }
    },
  },
};
