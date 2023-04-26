import camelcaseKey from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import {
  FieldResolver,
  queryField,
  intArg,
  stringArg,
  list,
  nullable,
} from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let searchTagResolver: FieldResolver<'Query', 'searchTag'> = async (
  _,
  { q, limit, selectedTags },
  context: Context,
) => {
  if (!limit) {
    limit = 5;
  }

  let body = {
    q,
    limit,
    selectedTags,
  };

  const config = {
    params: snakecaseKeys(body),
  };
  try {
    let url = `/tags/filter/search.json`;
    let { data: searchTag } = await context.client.get(url, config);

    let searchTagResult = searchTag.results;

    return camelcaseKey(searchTagResult, { deep: true });
  } catch (error) {
    throw errorHandler(error);
  }
};

let searchTagQuery = queryField('searchTag', {
  type: list('Tag'),
  args: {
    q: stringArg(),
    limit: nullable(intArg()),
    selectedTags: nullable(list(stringArg())),
  },
  resolve: searchTagResolver,
});

export { searchTagQuery };
