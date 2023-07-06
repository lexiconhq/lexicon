import axios from 'axios';
import { FieldResolver, mutationField, stringArg } from 'nexus';

import { ACCEPTED_LANGUAGE, CONTENT_JSON } from '../../constants';
import { errorHandler } from '../../helpers';
import { Context } from '../../types';

export let pushNotificationsMutation: FieldResolver<
  'Mutation',
  'pushNotifications'
> = async (
  _,
  { PushNotificationsToken, applicationName, platform, experienceId },
  context: Context,
) => {
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
      'Content-Type': CONTENT_JSON,
    },
  };
  try {
    await context.client.post(
      `/lexicon/push_notifications/subscribe.json`,
      {
        push_notifications_token: PushNotificationsToken,
        application_name: applicationName,
        platform: platform,
        experience_id: experienceId,
      },
      config,
    );
    return 'success';
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      // mean discourse instance doesn't have lexicon plugin
      return 'lexicon plugin not installed';
    }
    throw errorHandler(e);
  }
};

export let pushNotification = mutationField('pushNotifications', {
  type: 'String',
  args: {
    PushNotificationsToken: stringArg(),
    experienceId: stringArg(),
    applicationName: stringArg(),
    platform: stringArg(),
  },
  resolve: pushNotificationsMutation,
});
