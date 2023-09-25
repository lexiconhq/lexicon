import camelcaseKeys from 'camelcase-keys';
import { FieldResolver, queryField } from 'nexus';

import { errorHandler } from '../../helpers';
import { Context } from '../../types';

let badgeQueryResolver: FieldResolver<'Query', 'badge'> = async (
  _,
  __,
  context: Context,
) => {
  // let body = {
  //   // eslint-disable-next-line @typescript-eslint/camelcase
  //   only_listable: true,
  //   onlyListable: true,
  // };
  // params: body,
  // In discourse we can see that they're using request URL like this 'https://try.discourse.org/badges.json?only_listable=true&onlyListable=true'
  // but it still working even tho we don't use this body..
  try {
    let url = '/badges.json';
    let { data: badgeResult } = await context.client.get(url);
    return camelcaseKeys(badgeResult, { deep: true });
  } catch (error) {
    errorHandler(error);
  }
};

let badgeQuery = queryField('badge', {
  type: 'BadgeOutput',
  resolve: badgeQueryResolver,
});

export { badgeQuery };
