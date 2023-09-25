import { ReactNativeFile } from 'apollo-upload-client';

import getMimeFromImagePicker from './getMimeFromImagePicker';

export const createReactNativeFile = (
  filePath: string,
  customPrefix?: string,
) => {
  if (!filePath) {
    return null;
  }

  const prefix = customPrefix ? `${customPrefix}-` : '';
  const name = `${prefix}${new Date().getTime()}`;

  return new ReactNativeFile({
    uri: filePath,
    type: getMimeFromImagePicker(filePath),
    name,
  });
};
