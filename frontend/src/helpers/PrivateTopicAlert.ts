import { Alert } from 'react-native';

import { ERROR_PRIVATE_POST } from '../constants';

export function privateTopicAlert() {
  Alert.alert(
    ERROR_PRIVATE_POST.title,
    ERROR_PRIVATE_POST.content,
    [{ text: t('Got It') }],
    { cancelable: false },
  );
}
