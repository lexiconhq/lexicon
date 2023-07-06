import { FieldResolver, mutationField, stringArg, nullable } from 'nexus';

import { Context } from '../../types';
import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';

export let logoutMutationResolver: FieldResolver<'Mutation', 'logout'> = async (
  _,
  { username, pushNotificationsToken },
  context: Context,
) => {
  if (pushNotificationsToken) {
    try {
      const config = {
        headers: {
          'Accept-Language': ACCEPTED_LANGUAGE,
          'Content-Type': CONTENT_JSON,
        },
      };
      await context.client.post(
        `/lexicon/push_notifications/delete_subscribe.json`,
        {
          push_notifications_token: pushNotificationsToken,
        },
        config,
      );
    } catch (error) {
      /**
       * No action is taken when an error occurs
       * No action is required because we want the session to be successfully deleted even if there are errors when hitting the API to delete the token in the plugin.
       * For example, if we haven't installed the plugin, it will result in a 404 error when attempting to hit the delete_subscribe API.
       * Similarly, if there is an internal issue with the plugin, it may lead to a 500 error.
       */

      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(
          'Error when hit delete token plugin API ====>',
          error.message,
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          'Unknown error when hit delete token plugin API ====>',
          error,
        );
      }
    }
  }

  try {
    await context.client.delete(`/session/${username}.json`);
    return 'success';
  } catch {
    return 'failed';
  }
};

export let logoutMutation = mutationField('logout', {
  type: 'String',
  args: {
    username: stringArg(),
    pushNotificationsToken: nullable(stringArg()),
  },
  resolve: logoutMutationResolver,
});
