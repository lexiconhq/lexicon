/* eslint-disable @typescript-eslint/camelcase */
import { FieldResolver, mutationField, stringArg } from '@nexus/schema';

import { CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let pushNotificationMutation: FieldResolver<
  'Mutation',
  'pushNotification'
> = async (_, { expoPnToken, applicationName, platform }, context: Context) => {
  const config = {
    headers: {
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    await context.client.post(
      `/expo_pn/subscribe.json`,
      JSON.stringify({
        expo_pn_token: expoPnToken,
        application_name: applicationName,
        platform: platform,
      }),
      config,
    );
    return 'success';
  } catch (e) {
    throw errorHandler(e);
  }
};

export let pushNotification = mutationField('pushNotification', {
  type: 'String',
  args: {
    expoPnToken: stringArg(),
    applicationName: stringArg(),
    platform: stringArg(),
  },
  resolve: pushNotificationMutation,
});
