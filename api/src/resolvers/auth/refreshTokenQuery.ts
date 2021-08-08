import { FieldResolver, queryField } from '@nexus/schema';

import { checkSession } from '../../helpers';
import { Context } from '../../types';

export let refreshTokenQueryResolver: FieldResolver<
  'Query',
  'refreshToken'
> = async (_, __, context: Context) => {
  try {
    if (!context.client) {
      throw new Error('Not authorized');
    }
    return checkSession(context.client);
  } catch (error) {
    throw new Error(`Session not found: ${error.message}`);
  }
};

export let refreshTokenQuery = queryField('refreshToken', {
  type: 'RefreshTokenOutput',
  resolve: refreshTokenQueryResolver,
});
