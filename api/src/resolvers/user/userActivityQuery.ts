import camelcaseKeys from 'camelcase-keys';
import {
  FieldResolver,
  queryField,
  intArg,
  stringArg,
  list,
  nullable,
} from 'nexus';

import { errorHandler, USER_ACTIONS_URL } from '../../helpers';
import { Context } from '../../types';

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
    no_results_help_key: 'user_activity.no_default',
  };
  const config = {
    params: body,
  };

  try {
    let { data: userActivityResult } = await context.client.get(
      USER_ACTIONS_URL,
      config,
    );
    let userActions = userActivityResult.user_actions;
    if (!userActions) {
      return [];
    }

    return camelcaseKeys(userActions, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let userActivityQuery = queryField('userActivity', {
  type: list('UserActions'),
  args: {
    username: stringArg(),
    offset: intArg(),
    filter: nullable(stringArg()),
  },
  resolve: userActivityQueryResolver,
});

export { userActivityQuery };
