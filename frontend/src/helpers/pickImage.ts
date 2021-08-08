import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { getFormat } from './getFormat';

export async function pickImage(extensions?: Array<string>) {
  const ios = Platform.OS === 'ios';
  let permissionCameraRollResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionCameraRollResult.status !== 'granted') {
    return {
      error: 'denied',
    };
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!ios && !result) {
    // For android only see getPendingResultAsync expo documentation.
    let pendingResult = await ImagePicker.getPendingResultAsync();
    result = 'cancelled' in pendingResult ? pendingResult : { cancelled: true };
  }

  if (result.cancelled) {
    return {
      error: 'cancelled',
    };
  }

  let format = getFormat(result.uri);

  if (extensions && !extensions.includes(format)) {
    return {
      error: 'format',
    };
  }

  return {
    uri: result.uri,
  };
}
