import {
  createServer as createYogaServer,
  useLogger,
} from '@graphql-yoga/node';

import { getClient } from '../../client';
import { decodeToken } from '../../helpers/auth';
import { schema } from '../../schema';
import { Context } from '../../types';
import { errorHandler } from '../../helpers';
import { logger } from '../../logger';
import { REFRESH_TOKEN_COOKIE_FIELD } from '../../constants';

import { authPlugin } from './plugins';

export function createServer(hostname: string, port: number) {
  const graphQLServer = createYogaServer({
    schema,
    hostname,
    port,

    // The default behavior of GraphQL Yoga is to mask error messages.
    // However, the Lexicon frontend makes use of these, and Discourse has several
    // useful error messages, so here we instruct GraphQL Yoga to not mask the errors.
    maskedErrors: false,

    context: async ({ request, res }): Promise<Context> => {
      try {
        let authorization = request.headers.get('Authorization');
        let cookie = decodeToken(authorization);
        const userAgent = request.headers.get('User-Agent') ?? '';

        if (cookie.includes(REFRESH_TOKEN_COOKIE_FIELD)) {
          return {
            client: await getClient({
              cookies: cookie,
              userAgent,
              context: { request, response: res },
            }),
            isAuth: true,
          };
        }

        return {
          client: await getClient({
            userAgent,
            context: { request, response: res },
          }),
          isAuth: false,
        };
      } catch (error) {
        errorHandler(error);
        throw error; // avoid no return type, this shouldn't be reachable as errorHandler already throw
      }
    },
    endpoint: '/',
    plugins: [
      authPlugin,
      useLogger({
        skipIntrospection: true,
        logFn: (eventName, events) => {
          switch (eventName) {
            case 'execute-end':
            case 'subscribe-end':
              if ((events.result.errors?.length ?? 0) < 1) {
                break;
              }
              for (let error of events.result.errors) {
                const dateTime = new Date();
                logger.log(
                  'error',
                  '[%s] [%s] %s',
                  dateTime.toUTCString(),
                  error.path[0],
                  error.message,
                );
              }
              break;
          }
        },
      }),
    ],
  });

  return graphQLServer;
}
