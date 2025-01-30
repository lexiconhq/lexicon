import { createMiddleware } from '@mswjs/http-middleware';
import express from 'express';

import { MOCK_SERVER_PORT } from '../global';

import {
  aboutHandler,
  categoriesHandler,
  messagesHandler,
  notificationsHandler,
  pollHandler,
  profileHandler,
  siteHandler,
  timingsHandler,
  topicsHandler,
  userActivityHandler,
  userHandler,
  userStatusHandler,
} from './rest';

// Combine all handlers
export const handlers = [
  // http.get('http://localhost:8929/user/:username', (req) => {
  //   let data = new URL(req.request.url);
  //   console.log('data >>>', data.searchParams.get('filter'));
  //   console.log('username >>>', req);
  //   return HttpResponse.json({
  //     firstName: 'John',
  //     lastName: 'Maverick',
  //   });
  // }),
  ...profileHandler,
  ...notificationsHandler,
  ...siteHandler,
  ...userStatusHandler,
  ...userHandler,
  ...aboutHandler,
  ...timingsHandler,
  ...categoriesHandler,
  ...userActivityHandler,
  ...topicsHandler,
  ...pollHandler,
  ...messagesHandler,
];

export type MockServerContext = {
  stop: () => void;
};

export async function startMockServer(): Promise<MockServerContext> {
  const app = express();
  app.use('/images/emoji/twitter', express.static(__dirname + '/assets'));

  const middleware = createMiddleware(...handlers);
  app.use(middleware);

  const server = app.listen(MOCK_SERVER_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Mock server is running on http://localhost:${MOCK_SERVER_PORT}`,
    );
  });

  return {
    stop: async () => {
      server.close();
    },
  };
}
