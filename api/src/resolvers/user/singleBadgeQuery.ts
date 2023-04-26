import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField, intArg } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let singleBadgeQueryResolver: FieldResolver<'Query', 'singleBadge'> = async (
  _,
  { id },
  context: Context,
) => {
  try {
    let url = `/badges/${id}.json`;
    let { data: badgeResult } = await context.client.get(url);
    return camelcaseKeys(badgeResult, { deep: true });
  } catch (error) {
    errorHandler(error);
  }
};

let singleBadgeQuery = queryField('singleBadge', {
  type: 'SingleBadgeOutput',
  args: {
    id: intArg(),
  },
  resolve: singleBadgeQueryResolver,
});

export { singleBadgeQuery };
