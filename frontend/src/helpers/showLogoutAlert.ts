import { Alert } from 'react-native';

let alertShown = false;

export function showLogoutAlert() {
  // This condition is used to make sure only one logout alert show at same time
  if (!alertShown) {
    Alert.alert(
      t('You have been logged out'),
      t('Please try logging in again.'),
      [{ text: t('Got It'), onPress: () => (alertShown = false) }],
      { cancelable: false },
    );
    alertShown = true;
  }
}
