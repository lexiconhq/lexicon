import { Alert } from 'react-native';

import { ERROR_SETUP_PUSH_NOTIFICATIONS } from '../constants';

export function pushNotificationsSetupFailAlert() {
  Alert.alert(
    ERROR_SETUP_PUSH_NOTIFICATIONS.title,
    ERROR_SETUP_PUSH_NOTIFICATIONS.content,
    [{ text: t('Got It') }],
    { cancelable: false },
  );
}
