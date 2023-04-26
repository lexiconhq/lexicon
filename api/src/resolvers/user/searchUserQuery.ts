import camelcaseKey from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { FieldResolver, queryField, stringArg } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let searchUserQueryResolver: FieldResolver<'Query', 'searchUser'> = async (
  _,
  { search },
  context: Context,
) => {
  const searchConfig = snakecaseKeys({
    includeGroups: false,
    includeMentionableGroups: false,
    includeMessageableGroups: true,
    topicAllowedUsers: false,
  });
  const config = {
    params: {
      term: search,
      ...searchConfig,
    },
  };
  try {
    const url = `u/search/users.json`;
    let { data } = await context.client.get(url, config);

    if (!data.groups) {
      data.groups = [];
    }
    if (!data.users) {
      data.users = [];
    }

    return camelcaseKey(data, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let searchUserQuery = queryField('searchUser', {
  type: 'SearchUserOutput',
  args: {
    search: stringArg(),
  },
  resolve: searchUserQueryResolver,
});

export { searchUserQuery };
