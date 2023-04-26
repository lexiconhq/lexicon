/* eslint-disable no-console */
import { PROSE_APP_PORT, PROSE_APP_HOSTNAME } from '../constants';

import { checkDiscourseReachability } from './validate';
import { createServer } from './graphql';
import { getServerBanner } from './banner';

const server = createServer(PROSE_APP_HOSTNAME, PROSE_APP_PORT);

async function stop() {
  console.log('\nProse GraphQL: Waiting for open requests to finish...');
  await server.stop();
  console.log('Stopping the Prose GraphQL Server.');
}

export async function run() {
  await checkDiscourseReachability();
  process.on('SIGTERM', stop);
  process.on('SIGHUP', stop);

  console.log('\n', getServerBanner(), '\n');
  await server.start();
}
