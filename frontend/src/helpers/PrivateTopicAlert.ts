import { Alert } from 'react-native';

import { ERROR_PRIVATE_POST, ERROR_MESSAGE_INVALID_ACCESS } from '../constants';

export function privateTopicAlert() {
  Alert.alert(
    ERROR_PRIVATE_POST.title,
    ERROR_PRIVATE_POST.content,
    [{ text: t('Got It') }],
    { cancelable: false },
  );
}

export function messageInvalidAccessAlert() {
  Alert.alert(
    ERROR_MESSAGE_INVALID_ACCESS.title,
    ERROR_MESSAGE_INVALID_ACCESS.content,
    [{ text: t('Got It') }],
    { cancelable: false },
  );
}
