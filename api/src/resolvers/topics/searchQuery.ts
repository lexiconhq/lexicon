import camelcaseKey from 'camelcase-keys';
import { FieldResolver, queryField, intArg, stringArg, nullable } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';
import { ACCEPTED_LANGUAGE } from '../../constants';

let searchQueryResolver: FieldResolver<'Query', 'search'> = async (
  _,
  { search, page, order },
  context: Context,
) => {
  if (order) {
    search = `${search} order:${order}`;
  }
  const config = {
    headers: {
      'Accept-Language': ACCEPTED_LANGUAGE,
    },
    params: {
      q: search,
      page,
    },
  };
  try {
    let { data } = await context.client.get(`/search.json`, config);

    if (!data.posts) {
      data.posts = [];
    }
    if (!data.topics) {
      data.topics = [];
    }

    return camelcaseKey(data, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let searchQuery = queryField('search', {
  type: 'SearchOutput',
  args: {
    search: stringArg(),
    page: intArg(),
    order: nullable(stringArg()),
  },
  resolve: searchQueryResolver,
});

export { searchQuery };
