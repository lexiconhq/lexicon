import { PROSE_DISCOURSE_HOST } from '../constants';

export function getServerBanner() {
  const messageTitle = '-- Prose GraphQL Discourse API --';

  const messageForwarding = `forwarding Discourse requests to ${PROSE_DISCOURSE_HOST}`;

  const lines = [messageTitle, messageForwarding];

  return lines.join('\n');
}
