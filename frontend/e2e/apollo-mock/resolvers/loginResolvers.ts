import { mockUsers, mockToken, emailToken } from '../data';
import { LoginOutputUnion } from '../generated/server';

export const loginResolvers = {
  LoginOutputUnion: {
    __resolveType(obj: LoginOutputUnion) {
      if ('user' in obj && 'token' in obj) {
        return 'LoginOutput';
      } else if (
        'secondFactorRequired' in obj &&
        'error' in obj &&
        'reason' in obj
      ) {
        return 'SecondFactorRequired';
      }
      return null; // Return null if the type cannot be resolved
    },
  },

  Mutation: {
    login: (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      // Perform your mock login logic here
      if (email === 'test@example.com' && password === 'password') {
        return {
          token: mockToken,
          user: mockUsers[0],
          enableLexiconPushNotifications: false,
        };
      } else {
        throw new Error('Incorrect username, email or password');
      }
    },
    authenticateLoginLink: (_: unknown, { token }: { token: string }) => {
      if (token === emailToken) {
        return {
          token: mockToken,
          user: mockUsers[0],
          enableLexiconPushNotifications: false,
        };
      }
      throw new Error('Sorry link is not valid');
    },
    activateAccount: (_: unknown, { token }: { token: string }) => {
      if (token === emailToken) {
        return {
          token: mockToken,
          user: mockUsers[0],
          enableLexiconPushNotifications: false,
        };
      }
      throw new Error('Sorry link is not valid');
    },
    logout: (
      _: unknown,
      __: { username: string; pushNotificationsToken: string },
    ) => {
      return 'success';
    },
  },
};
