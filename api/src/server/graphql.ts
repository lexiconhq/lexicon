import { GraphQLServer } from 'graphql-yoga';
import { ContextParameters } from 'graphql-yoga/dist/types';

import { getClient } from '../client';
import { decodeToken } from '../helpers/auth';
import { permissions } from '../middlewares/permission';
import { schema } from '../schema';

export const graphQLServer = new GraphQLServer({
  schema,
  context: async ({ request }: ContextParameters) => {
    let authorization = request.header('Authorization');
    let cookie = decodeToken(authorization);
    if (cookie.includes('_t=')) {
      return {
        client: await getClient(cookie),
        isAuth: true,
      };
    }
    return {
      client: await getClient(),
      isAuth: false,
    };
  },
  middlewares: [permissions],
});
