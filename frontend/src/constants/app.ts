import Constants from 'expo-constants';

const { manifest } = Constants;

export function getProseEndpoint(
  proseUrl?: string,
  inferDevelopmentHost?: boolean,
) {
  if (!proseUrl) {
    throw new Error('proseUrl must be set.');
  }

  const hostNameSeparator = proseUrl.split(':');

  const hostName = hostNameSeparator[0] + ':' + hostNameSeparator[1];

  if (!hostName.startsWith('http://') && !hostName.startsWith('https://')) {
    throw new Error('proseUrl must start with http:// or https://');
  }

  let delimitedProsePort = '';
  let proseSubPath = '';

  if (hostNameSeparator.length > 2) {
    // Example `proseUrl`: 127.0.0.1:8080 or 127.0.0.1:8080/test
    delimitedProsePort = ':' + hostNameSeparator[2].split('/')[0];
    proseSubPath = hostNameSeparator[2].split('/')[1];
  } else {
    // Example `proseUrl`: 127.0.0.1 or 127.0.0.1/test
    delimitedProsePort = '';
    proseSubPath = hostNameSeparator[1].split('/')[3];
  }

  const defaultValue = proseUrl;

  if (process.env.NODE_ENV === 'production') {
    return defaultValue;
  }

  if (
    !defaultValue.includes('://localhost') &&
    !defaultValue.includes('://127.0.0.1')
  ) {
    return defaultValue;
  }

  // Only if we're not in production, and we're attempting to connect our local machine
  // (localhost or 127.0.0.1), extract the debuggerHost if possible and use that instead.
  // This allows the Android Emulator, as well as your own device on the same network, to
  // access your local machine to connect to a locally running Prose instance.

  const { debuggerHost } = manifest ?? {};

  // INFER_DEVELOPMENT_HOST is a flag from the .env file that applies only when `NODE_ENV` is not 'production'.
  // When true, it will override `http://localhost` and `http://127.0.0.1` with the host of the development machine.
  // This is useful for on-device testing through the Expo Go app.

  if (!debuggerHost || !inferDevelopmentHost) {
    return defaultValue;
  }

  // Example `debuggerHost`: 192.168.0.53:19000
  const machineHost = debuggerHost.split(':')[0];

  if (!machineHost) {
    return defaultValue;
  }

  if (proseSubPath) {
    return `http://${machineHost}${delimitedProsePort}/${proseSubPath}`;
  } else {
    return `http://${machineHost}${delimitedProsePort}`;
  }
}
