import { AxiosResponse } from 'axios';
import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField, stringArg } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context, NotificationOutput } from '../../types';

let userProfileQueryResolver: FieldResolver<'Query', 'userProfile'> = async (
  _,
  { username },
  context: Context,
) => {
  try {
    let { data } = await context.client.get(`/users/${username}.json`);

    let camelcasedData = camelcaseKey(data, { deep: true });
    let thereIsUnreadNotif = false;

    if (camelcasedData.user.hasOwnProperty('email')) {
      let { data: notifData }: AxiosResponse<NotificationOutput> =
        await context.client.get('/notifications.json?filter=unread&limit=30');
      thereIsUnreadNotif = !!notifData.notifications.length;
    }

    return { ...camelcasedData, unreadNotification: thereIsUnreadNotif };
  } catch (error) {
    throw errorHandler(error);
  }
};

let userProfileQuery = queryField('userProfile', {
  type: 'UserProfileOutput',
  args: {
    username: stringArg(),
  },
  resolve: userProfileQueryResolver,
});

export { userProfileQuery, userProfileQueryResolver };
