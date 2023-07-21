import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

import { DEFAULT_NOTIFICATION_CHANNEL_INPUT } from '../constants';

interface ExpoPushTokenHandlerBaseResult {
  message: string;
}

interface ExpoPushTokenHandlerSuccessResult
  extends ExpoPushTokenHandlerBaseResult {
  success: true;
  token: string;
}
interface ExpoPushTokenHandlerFailResult
  extends ExpoPushTokenHandlerBaseResult {
  success: false;
  token: null;
}

type ExpoPushTokenHandlerResult = Promise<
  ExpoPushTokenHandlerSuccessResult | ExpoPushTokenHandlerFailResult
>;

export async function getExpoPushTokenHandler(): ExpoPushTokenHandlerResult {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(
      'default',
      DEFAULT_NOTIFICATION_CHANNEL_INPUT,
    );
  }

  if (!Device.isDevice) {
    Alert.alert('Push Notifications are only supported on physical devices.');
    return {
      success: false,
      message: 'PushNotificationsNotSupported: Must use physical device.',
      token: null,
    };
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Something went wrong when configuring Push Notifications.');
      return {
        success: false,
        message: 'PushNotificationsNotSupported: Permission not granted',
        token: null,
      };
    }
    /**
     * Add project ID to the getExpoPushTokenAsync function because in the new version, the experience ID is no longer used. The project ID typically generates as @kfox/<insert your app name> during local development.
     * Now, it is necessary to declare the project ID in the app.json file before being able to use push notifications.
     *
     * for more detail. Check this link https://docs.expo.dev/versions/latest/sdk/notifications/#expopushtokenoptions
     */

    let { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    return {
      success: true,
      message: '',
      token: token,
    };
  } catch (error) {
    let errorMessage =
      error instanceof Error ? error.message : 'Something unexpected happened.';
    return {
      success: false,
      message: `PushNotificationsNotSupported: ${errorMessage}`,
      token: null,
    };
  }
}
