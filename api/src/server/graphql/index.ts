import { createServer as createYogaServer } from '@graphql-yoga/node';

import { getClient } from '../../client';
import { decodeToken } from '../../helpers/auth';
import { schema } from '../../schema';
import { Context } from '../../types';
import { errorHandler } from '../../helpers';

import { authPlugin } from './plugins';

const REFRESH_TOKEN_COOKIE_FIELD = '_t=';

export function createServer(hostname: string, port: number) {
  const graphQLServer = createYogaServer({
    schema,
    hostname,
    port,

    // The default behavior of GraphQL Yoga is to mask error messages.
    // However, the Lexicon frontend makes use of these, and Discourse has several
    // useful error messages, so here we instruct GraphQL Yoga to not mask the errors.
    maskedErrors: false,

    context: async ({ request }): Promise<Context> => {
      try {
        let authorization = request.headers.get('Authorization');
        let cookie = decodeToken(authorization);
        const userAgent = request.headers.get('User-Agent') ?? '';
        if (cookie.includes(REFRESH_TOKEN_COOKIE_FIELD)) {
          return {
            client: await getClient({ cookies: cookie, userAgent }),
            isAuth: true,
          };
        }

        return {
          client: await getClient({ userAgent }),
          isAuth: false,
        };
      } catch (error) {
        errorHandler(error);
        throw error; // avoid no return type, this shouldn't be reachable as errorHandler already throw
      }
    },
    endpoint: '/',
    plugins: [authPlugin],
  });

  return graphQLServer;
}
