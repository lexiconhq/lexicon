import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField, intArg } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let notificationQueryResolver: FieldResolver<'Query', 'notification'> = async (
  _,
  { page },
  context: Context,
) => {
  if (page < 1) {
    page = 1;
  }
  let body = {
    filter: 'all',
    offset: (page - 1) * 60,
  };
  const config = {
    params: body,
  };
  try {
    let url = '/notifications.json';
    let { data: notificationResult } = await context.client.get(url, config);

    return camelcaseKeys(notificationResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let notificationQuery = queryField('notification', {
  type: 'Notifications',
  args: {
    page: intArg(),
  },
  resolve: notificationQueryResolver,
});

export { notificationQuery };
