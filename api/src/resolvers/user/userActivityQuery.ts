import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField, intArg, stringArg } from '@nexus/schema';

import { errorHandler } from '../../helpers';
import { Context, UserAction } from '../../types';

let userActivityQueryResolver: FieldResolver<'Query', 'userActivity'> = async (
  _,
  { username, offset, filter },
  context: Context,
) => {
  if (offset < 0) {
    offset = 0;
  }

  if (!filter) {
    filter = '1,4,5';
  }

  let body = {
    offset,
    username,
    filter,
    // eslint-disable-next-line @typescript-eslint/camelcase
    no_results_help_key: 'user_activity.no_default',
  };
  const config = {
    params: body,
  };

  let url = '/user_actions.json';

  try {
    if (filter === '1') {
      let fetchAll = true;
      let userAction: Array<UserAction> = [];
      let fetchAllOffset = 0;

      while (fetchAll) {
        let fetchAllBody = {
          offset: fetchAllOffset,
          username,
          filter,
        };

        const fetchAllConfig = {
          params: fetchAllBody,
        };
        let { data: userActivityResult } = await context.client.get(
          url,
          fetchAllConfig,
        );
        let tempUserAction = userActivityResult.user_actions;
        fetchAllOffset = fetchAllOffset + 30;
        userAction = [...userAction, ...tempUserAction];
        if (tempUserAction.length < 30) {
          fetchAll = false;
        }
      }
      return camelcaseKeys(userAction, { deep: true });
    } else {
      let { data: userActivityResult } = await context.client.get(url, config);
      let userAction = userActivityResult.user_actions;
      if (!userAction) {
        return [];
      } else {
        return camelcaseKeys(userAction, { deep: true });
      }
    }
  } catch (error) {
    throw errorHandler(error);
  }
};

let userActivityQuery = queryField('userActivity', {
  type: 'UserActions',
  list: true,
  args: {
    username: stringArg({ required: true }),
    offset: intArg({ required: true }),
    filter: stringArg(),
  },
  resolve: userActivityQueryResolver,
});

export { userActivityQuery };
