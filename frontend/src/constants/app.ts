import { MOBILE_PROSE_HOST, MOBILE_PROSE_PORT } from '@env';
import Constants from 'expo-constants';

const { manifest } = Constants;

function getProseEndpoint() {
  const hostName = MOBILE_PROSE_HOST;
  if (!hostName) {
    throw new Error('MOBILE_PROSE_HOST must be set.');
  }

  if (!hostName.startsWith('http://') && !hostName.startsWith('https://')) {
    throw new Error('MOBILE_PROSE_HOST must start with http:// or https://');
  }

  const delimitedProsePort = MOBILE_PROSE_PORT ? `:${MOBILE_PROSE_PORT}` : '';

  const defaultValue = `${hostName}${delimitedProsePort}`;
  if (process.env.NODE_ENV === 'production') {
    return defaultValue;
  }

  if (
    !hostName.includes('://localhost') &&
    !hostName.includes('://127.0.0.1')
  ) {
    return defaultValue;
  }

  // Only if we're not in production, and we're attempting to connect our local machine
  // (localhost or 127.0.0.1), extract the debuggerHost if possible and use that instead.
  // This allows the Android Emulator, as well as your own device on the same network, to
  // access your local machine to connect to a locally running Prose instance.

  const { debuggerHost } = manifest ?? {};
  if (!debuggerHost) {
    return defaultValue;
  }

  // Example `debuggerHost`: 192.168.0.53:19000
  const machineHost = debuggerHost.split(':')[0];
  if (!machineHost) {
    return defaultValue;
  }

  return `http://${machineHost}${delimitedProsePort}`;
}

export const PROSE_ENDPOINT = getProseEndpoint();
