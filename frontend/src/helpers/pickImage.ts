import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { getFormat } from './getFormat';

export async function pickImage(extensions?: Array<string>) {
  const ios = Platform.OS === 'ios';
  let permissionCameraRollResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

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
    // On Android, `result` can sometimes be `undefined`. The official Expo
    // documentation has a workaround for this, which is to retrieve it from
    // `getPenderingResultAsync`.
    //
    // Read more: https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickergetpendingresultasync
    let pendingResults = await ImagePicker.getPendingResultAsync();

    // For now, we only ever want a single image that was selected.
    // If this ever changes in the future, be sure to update `result`
    // to reflect that it will be an array of `uri`s.
    const [firstResult] = pendingResults;
    result =
      'canceled' in firstResult
        ? firstResult
        : { canceled: true, assets: null };
  }

  if (result.canceled || !result.assets.length) {
    return {
      error: 'cancelled',
    };
  }

  let format = getFormat(result.assets[0].uri);

  if (extensions && !extensions.includes(format)) {
    return {
      error: 'format',
    };
  }

  return {
    uri: result.assets[0].uri,
  };
}
