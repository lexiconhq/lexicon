import { AuthSchema, preExecRule } from '@graphql-authz/core';
import { authZEnvelopPlugin } from '@graphql-authz/envelop-plugin';

import { Context } from '../../types';

/**
 * ## About the `plugins.ts` file
 *
 * `plugins` are intended to be used with our GraphQL server, GraphQL Yoga, which
 * internally leverages Envelop for its plugin system.
 *
 * Envelop is a library that serves as a GraphQL plugin system.
 *
 * `graphql-authz` is one such plugin that is compatible with Envelop. It provides a
 * powerful and flexible authorization solution.
 *
 * `graphql-authz` works by wrapping the GraphQL execution phase. This allows you to run
 * authorization logic before and after this phase, via Pre-exec Rules and Post-exec Rules.
 *
 * - The pre-execution phase is for static auth rules based on context & input.
 * - The post-execution phase is for flexible auth rules based on the execution result.
 *
 * This is currently the only plugin that we require for this project. We use it to ensure
 * that the user is authenticated in order to perform certain queries and mutations.
 *
 * When a request does not include authenticated information for one of these operations,
 * it returns a simple message "You need to be logged in to do that."
 *
 * This mirrors the message that Discourse returns in this situation, so it may not
 * be necessary. But it may be allowing us to provide a more uniform response. It is a
 * topic that can be investigated if necessary.
 *
 * All of the authenticated queries and mutations are specified below.
 *
 * These primarily consist of mutations, since those are typically the only operations
 * in Discourse that require an authenticated user. The exceptions to this are the queries
 * for notifications, private messages, and badges (which don't make sense for an anonymous
 * user).
 *
 * Also, the `login` mutation does not require an authenticated user, as that is
 * the way in which a user becomes authenticated.
 */

// Create our Rule, which simply checks the context to see if the user is authenticated.
// If they are not, return `unauthenticatedMessage` as the error message.
const unauthenticatedMessage = 'You need to be logged in to do that.';
const configureRule = preExecRule({ error: unauthenticatedMessage });
const IsAuthenticated = configureRule(({ isAuth }: Context) => isAuth);

// This function generates the necessary boilerplate for the authzEnvelopPlugin
// so that we can generate the `authSchema` that it expects.
//
// `authZEnvelopPlugin` allows us to reference our rule by its string-literal
// representation, which is mapped when we declare the `rules` variable below.
function getAuthenticatedSchema(keys: Array<string>) {
  return keys.reduce(
    (accumulator, current) => ({
      ...accumulator,
      [current]: { __authz: { rules: ['IsAuthenticated'] } },
    }),
    {},
  );
}

// Below we define the queries and mutations that require authentication.
const guardedQueries = ['notification', 'privateMessage', 'badge'];
const guardedMutations = [
  'timings',
  'newPrivateMessage',
  'newTopic',
  'reply',
  'editPost',
  'editTopic',
  'addEmail',
  'changeEmail',
  'deleteEmail',
  'setPrimaryEmail',
  'bookmarkPost',
  'changeUsername',
  'flagPost',
  'likeTopicOrPost',
  'upload',
  'editProfile',
  'saveProfilePicture',
];

const authenticatedSchema: AuthSchema = {
  Mutation: getAuthenticatedSchema(guardedMutations),
  Query: getAuthenticatedSchema(guardedQueries),
};

// Define the rules for our `authZEnvelopPlugin`, in this case just
// our `IsAuthenticated` rule from above.
const rules = { IsAuthenticated } as const;

export const authPlugin = authZEnvelopPlugin({
  rules,
  authSchema: authenticatedSchema,
});
