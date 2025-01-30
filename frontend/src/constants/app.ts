import { makeVar } from '@apollo/client';
import { Platform } from 'react-native';

import Config from '../../Config';
import { RootStackParamList, RootStackRouteName } from '../types';

export function getDiscourseEndpoint(
  discourseUrl?: string,
  inferDevelopmentHost?: boolean,
) {
  if (!discourseUrl) {
    throw new Error('discourseUrl must be set.');
  }

  const hostNameSeparator = discourseUrl.split(':');

  const hostName = hostNameSeparator[0] + ':' + hostNameSeparator[1];

  if (!hostName.startsWith('http://') && !hostName.startsWith('https://')) {
    throw new Error('discourseUrl must start with http:// or https://');
  }

  let delimitedDiscoursePort = '';
  let discourseSubPath = '';

  if (hostNameSeparator.length > 2) {
    // Example `discourseUrl`: 127.0.0.1:8080 or 127.0.0.1:8080/test
    delimitedDiscoursePort = ':' + hostNameSeparator[2].split('/')[0];
    discourseSubPath = hostNameSeparator[2].split('/')[1];
  } else {
    // Example `discourseUrl`: 127.0.0.1 or 127.0.0.1/test
    delimitedDiscoursePort = '';
    discourseSubPath = hostNameSeparator[1].split('/')[3];
  }

  const defaultValue = discourseUrl;

  if (process.env.NODE_ENV === 'production') {
    return defaultValue;
  }

  if (
    !defaultValue.includes('://localhost') &&
    !defaultValue.includes('://127.0.0.1')
  ) {
    return defaultValue;
  }

  // INFER_DEVELOPMENT_HOST is a flag from the configuration file that applies only when the app is in local development mode.
  // When set to true, it overrides `http://localhost` and `http://127.0.0.1` with a specific host based on the platform:
  // - On Android, it uses `10.0.2.2` to connect to the local machine.
  // - On iOS, it continues to use `localhost`.
  // For more details, refer to: https://stackoverflow.com/questions/33704130/react-native-android-fetch-failing-on-connection-to-local-api

  if (!inferDevelopmentHost) {
    return defaultValue;
  }

  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}${delimitedDiscoursePort}${
    discourseSubPath ? `/${discourseSubPath}` : ''
  }`;
}

export let discourseHost = getDiscourseEndpoint(
  Config.discourseUrl,
  'inferDevelopmentHost' in Config ? Config.inferDevelopmentHost : undefined,
);

export let currentScreenVar = makeVar<{
  screen: RootStackRouteName;
  params: RootStackParamList[RootStackRouteName];
}>({ screen: 'ProfileScreen', params: undefined });
