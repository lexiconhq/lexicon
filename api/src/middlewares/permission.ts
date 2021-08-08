import { rule, shield } from 'graphql-shield';

import { Context } from '../types';

let isAuthenticated = rule()(async (_, __, ctx: Context) => {
  return ctx.isAuth;
});

let permissions = shield(
  {
    Query: {
      notification: isAuthenticated,
      privateMessage: isAuthenticated,
      badge: isAuthenticated,
    },
    Mutation: {
      timings: isAuthenticated,
      newPrivateMessage: isAuthenticated,
      newTopic: isAuthenticated,
      reply: isAuthenticated,
      editPost: isAuthenticated,
      editTopic: isAuthenticated,
      addEmail: isAuthenticated,
      changeEmail: isAuthenticated,
      deleteEmail: isAuthenticated,
      setPrimaryEmail: isAuthenticated,
      bookmarkPost: isAuthenticated,
      changeUsername: isAuthenticated,
      flagPost: isAuthenticated,
      likePost: isAuthenticated,
      upload: isAuthenticated,
      editProfile: isAuthenticated,
      saveProfilePicture: isAuthenticated,
    },
  },
  {
    fallbackError: 'You need to be logged in to do that.',
  },
);

export { permissions };
