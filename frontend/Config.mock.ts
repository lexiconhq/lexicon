/**
 * This file is created to override the getConfig function from the Config.ts file.
 * It will be used when we attempt to run detox tests using a mock server.
 *
 * For reference on how to handle the mock.ts file, it is set up in the metro.config.js where a condition for sourceExts has been added.
 * and for more detail implementation see this docs https://github.com/wix/Detox/blob/master/docs/guide/mocking.md
 */

import { Platform } from 'react-native';

import { RequiredConfig, LocalConfig } from './Config';
import { MOCK_SERVER_PORT } from './e2e/global';

function getConfig(): RequiredConfig | LocalConfig {
  return {
    proseUrl:
      Platform.OS === 'android'
        ? /**
           * note 10.0.2.2 is ip localhost for android emulator. which we enable traffic in detox configuration for more detail information
           * see this detox configuration https://wix.github.io/Detox/docs/introduction/project-setup#43-enabling-unencrypted-traffic-for-detox
           * and about localhost ip https://developer.android.com/studio/run/emulator-networking
           */
          `http://10.0.2.2:${MOCK_SERVER_PORT}`
        : `http://localhost:${MOCK_SERVER_PORT}`,
  };
}

export default getConfig();
