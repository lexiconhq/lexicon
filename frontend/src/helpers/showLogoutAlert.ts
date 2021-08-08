import { Alert } from 'react-native';

export function showLogoutAlert() {
  Alert.alert(
    t('You have been logged out'),
    t('Please try logging in again.'),
    [{ text: t('Got It') }],
    { cancelable: false },
  );
}
