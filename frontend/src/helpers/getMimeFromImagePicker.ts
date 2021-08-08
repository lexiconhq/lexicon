import { getFormat } from './getFormat';

export default (filePath: string) => {
  const fileExtension = getFormat(filePath);

  switch (fileExtension) {
    case 'jpg':
      return 'image/jpg';
    case 'jpeg':
      return 'image/jpeg';
    default:
      return `image/${fileExtension || ''}`;
  }
};
