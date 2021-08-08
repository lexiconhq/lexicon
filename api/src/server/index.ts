/* eslint-disable no-console */
import { Server } from 'http';

import { PROSE_APP_PORT, PROSE_APP_HOSTNAME } from '../constants';

import { checkDiscourseReachability } from './validate';
import { graphQLServer } from './graphql';
import { getServerBanner } from './banner';

// `graphql-yoga` doesn't seem to support providing a custom hostname to Express (in its latest published release).
// Here, we write a helper function to use the underlying parts of `graphql-yoga` to pass
// the correct parameters to Express.
//
// Note: `graphql-yoga` has recently changed maintainers, and they don't seem to intend to make any releases,
// even with the existing useful changes, until they have done a huge refactor based around their tool, Envelop.
let httpServer: Server;
function start() {
  httpServer = graphQLServer.createHttpServer({ port: PROSE_APP_PORT });

  httpServer.listen(PROSE_APP_PORT, PROSE_APP_HOSTNAME, () =>
    console.log(getServerBanner()),
  );
}

function stop() {
  if (!httpServer) {
    return;
  }

  console.log('\nProse GraphQL: Waiting for open requests to finish...');
  httpServer.close(() => {
    console.log('Stopping the Prose GraphQL Server.');
  });
}

export async function run() {
  await checkDiscourseReachability();
  process.on('SIGTERM', stop);
  process.on('SIGHUP', stop);

  start();
}
