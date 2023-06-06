import { FieldResolver, mutationField, nullable, stringArg } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let pushNotificationMutation: FieldResolver<
  'Mutation',
  'pushNotification'
> = async (_, { expoPnToken, applicationName, platform }, context: Context) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    await context.client.post(
      `/expo_pn/subscribe.json`,
      {
        expo_pn_token: expoPnToken,
        application_name: applicationName,
        platform: platform,
      },
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
    expoPnToken: nullable(stringArg()),
    applicationName: nullable(stringArg()),
    platform: nullable(stringArg()),
  },
  resolve: pushNotificationMutation,
});
