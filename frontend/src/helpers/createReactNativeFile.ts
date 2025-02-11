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

  return {
    uri: filePath,
    type: getMimeFromImagePicker(filePath),
    name,
  };
};
