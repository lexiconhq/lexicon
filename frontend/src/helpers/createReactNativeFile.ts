import { ReactNativeFile } from 'apollo-upload-client';

import getMimeFromImagePicker from './getMimeFromImagePicker';

export const createReactNativeFile = (
  filePath: string,
  customPrefix?: string,
) => {
  if (filePath) {
    return new ReactNativeFile({
      uri: filePath,
      type: getMimeFromImagePicker(filePath),
      name: `${customPrefix}-${new Date().getTime()}`,
    });
  }

  return null;
};
