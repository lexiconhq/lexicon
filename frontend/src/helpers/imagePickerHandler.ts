import { Alert } from 'react-native';

import { pickImage } from './pickImage';

export async function imagePickerHandler(
  extensions: Array<string> | undefined,
) {
  let stringifyExtensions = extensions?.toString();
  let result = await pickImage(extensions);

  switch (result.error) {
    case 'format': {
      Alert.alert(
        t('Failed!'),
        t(
          `Please upload image with a suitable format in {stringifyExtensions}`,
          {
            stringifyExtensions,
          },
        ),
        [{ text: t('Got it') }],
      );
      return;
    }
    case 'denied': {
      Alert.alert(
        t('Photo Permissions Required'),
        t(
          `Please adjust your phone's settings to allow the app to access your photos.`,
        ),
        [{ text: t('Got it') }],
      );
      return;
    }
    case 'cancelled': {
      return;
    }
  }

  return result;
}
