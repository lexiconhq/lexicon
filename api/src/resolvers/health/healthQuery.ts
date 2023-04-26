import { FieldResolver, queryField } from 'nexus';
import { AxiosError } from 'axios';

import { Context } from '../../types';
import { PROSE_DISCOURSE_HOST } from '../../constants';

let healthQueryResolver: FieldResolver<'Query', 'health'> = async (
  _,
  __,
  context: Context,
) => {
  let discourseError: Error | undefined;
  let isDiscourseReachable = true;
  try {
    await context.client.get('/site.json');
  } catch (error) {
    let e = error as AxiosError;
    discourseError = e;
    if (e.response === undefined) {
      isDiscourseReachable = false;
    }
  }
  return {
    isDiscourseReachable,
    discourseError: discourseError?.toString(),
    discourseHost: PROSE_DISCOURSE_HOST,
  };
};

let healthQuery = queryField('health', {
  type: 'HealthCheck',
  resolve: healthQueryResolver,
});

export { healthQuery };
