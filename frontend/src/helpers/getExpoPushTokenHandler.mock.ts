import * as Device from 'expo-device';

import { mockToken } from '../../e2e/apollo-mock/data';

export async function getExpoPushTokenHandler() {
  if (!Device.isDevice) {
    return {
      success: false,
      message: 'PushNotificationsNotSupported: Must use physical device.',
      token: null,
    };
  }

  return {
    success: true,
    message: '',
    token: mockToken,
  };
}
