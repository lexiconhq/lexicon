import {
  PROSE_DISCOURSE_HOST,
  PROSE_APP_PORT,
  PROSE_APP_HOSTNAME,
} from '../constants';

export function getServerBanner() {
  const messageTitle = '-- Prose GraphQL Discourse API --';

  let scheme = 'http://';

  // Don't append a port suffix to the server banner unless one is set.
  let portSuffix = PROSE_APP_PORT ? `:${PROSE_APP_PORT}` : '';

  // If `PROSE_APP_PORT` is 443, don't print it in the banner.
  // `https://myprosehost.com` looks better than `https://myprosehost.com:443`.
  if (PROSE_APP_PORT === 443) {
    scheme = 'https://';
    portSuffix = '';
  }

  // Compose the host we're listening on as the provided hostname followed by the port suffix.
  const displayHost = `${scheme}${PROSE_APP_HOSTNAME}${portSuffix}`;

  const messageListening = `listening at ${displayHost}`;
  const messageForwarding = `forwarding Discourse requests to ${PROSE_DISCOURSE_HOST}`;

  const lines = [messageTitle, messageListening, messageForwarding];

  return lines.join('\n');
}
