import { config } from 'dotenv';

config();

import { EXIT_CODE_INVALID_ARGUMENT } from './exitCodes';

// We primarily use `SKIP_VALIDATION` for the scenario where we transpile the
// API in order to populate `src/generated/schema.graphql`. This is used as part
// of the test suite.
const shouldValidate = process.env.SKIP_VALIDATION === undefined;

const DEFAULT_PROSE_APP_HOSTNAME = '0.0.0.0';
export const DEFAULT_PROSE_APP_PORT = 80;

// Per Express's requirement, ensure that the hostname does not have the scheme (http://, etc.)
// included in it.
if (shouldValidate) {
  const { PROSE_APP_HOSTNAME, PROSE_DISCOURSE_HOST } = process.env;

  if (PROSE_DISCOURSE_HOST === undefined) {
    // eslint-disable-next-line no-console
    console.error(
      'Missing required environment variable PROSE_DISCOURSE_HOST.\n\nExample Value: https://meta.discourse.org\n',
    );
    process.exit(EXIT_CODE_INVALID_ARGUMENT);
  }

  const invalidHostName =
    PROSE_APP_HOSTNAME?.startsWith('http://') ||
    PROSE_APP_HOSTNAME?.startsWith('https://');

  if (invalidHostName) {
    // eslint-disable-next-line no-console
    console.error(
      'The hostname cannot not start with http:// or https://.\n\nExample value: 127.0.0.1\n',
    );
    process.exit(EXIT_CODE_INVALID_ARGUMENT);
  }
}

export function getAppPort(nodePort?: string, prosePort?: string) {
  const definedPort = nodePort ?? prosePort;
  if (!definedPort) {
    return DEFAULT_PROSE_APP_PORT;
  }

  let parsed = Number.parseInt(definedPort, 10);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  // Check prose port if the definedPort value is different from prose port
  if (!prosePort || definedPort === prosePort) {
    return DEFAULT_PROSE_APP_PORT;
  }

  parsed = Number.parseInt(prosePort, 10);
  if (Number.isNaN(parsed)) {
    return DEFAULT_PROSE_APP_PORT;
  }
  return parsed;
}

export const PROSE_APP_PORT = getAppPort(
  process.env.PORT,
  process.env.PROSE_APP_PORT,
);

export const PROSE_APP_HOSTNAME =
  process.env.PROSE_APP_HOSTNAME ?? DEFAULT_PROSE_APP_HOSTNAME;

// Above, we throw if this value is not set, so we can rely on it to be defined.
export const PROSE_DISCOURSE_HOST = process.env.PROSE_DISCOURSE_HOST as string;

export const PROSE_DISCOURSE_UPLOAD_HOST =
  process.env.PROSE_DISCOURSE_UPLOAD_HOST ?? PROSE_DISCOURSE_HOST;

// `SKIP_CHECK_DISCOURSE` is used to bypass the process of ensuring that the Discourse
// host provided is actually online and reachable by the Prose server. It is a simple
// request that is dispatched before the server begins listening on its assigned host.
export const SHOULD_VALIDATE_DISCOURSE =
  process.env.SKIP_CHECK_DISCOURSE === undefined;
